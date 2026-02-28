/**
 * AR Bridge — Unified measurement API
 *
 * Provides a single interface for AR measurement that:
 * 1. Checks device AR capability
 * 2. Uses native ARKit (iOS) or ARCore (Android) when available
 * 3. Falls back to photo-based measurement when AR is unavailable
 *
 * Usage:
 *   const ar = new ARBridge();
 *   const support = await ar.checkSupport();
 *   if (support.arSupported) {
 *     await ar.startSession();
 *     const result = await ar.measure(screenX, screenY);
 *     // result.distanceInches, result.orientation, etc.
 *   }
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const NativeAR = NativeModules.ARMeasureModule;
const eventEmitter = NativeAR ? new NativeEventEmitter(NativeAR) : null;

// ─── Support Detection ───────────────────────────────────────────

export async function checkARSupport() {
  if (!NativeAR) {
    return {
      arSupported: false,
      lidarAvailable: false,
      nativeModuleLoaded: false,
      fallbackAvailable: true,
      reason: 'Native AR module not available (running in Expo Go or web)',
    };
  }

  try {
    const result = await NativeAR.checkSupport();
    return {
      ...result,
      nativeModuleLoaded: true,
      fallbackAvailable: true,
    };
  } catch (error) {
    return {
      arSupported: false,
      lidarAvailable: false,
      nativeModuleLoaded: true,
      fallbackAvailable: true,
      error: error.message,
    };
  }
}

// ─── AR Session Manager ──────────────────────────────────────────

export class ARSession {
  constructor() {
    this.isRunning = false;
    this.listeners = {};
    this.subscriptions = [];
  }

  /**
   * Start an AR measurement session
   * @param {Object} options - Session options
   * @returns {Promise<Object>} Session status
   */
  async start(options = {}) {
    if (!NativeAR) {
      throw new Error('AR not available — use photo measurement fallback');
    }

    const result = await NativeAR.startSession(options);
    this.isRunning = true;
    this._setupEventListeners();
    return result;
  }

  /**
   * Stop the AR session and clean up resources
   */
  stop() {
    if (NativeAR) {
      NativeAR.stopSession();
    }
    this.isRunning = false;
    this._removeEventListeners();
  }

  /**
   * Place a measurement point at the given screen coordinates
   * First call sets start point, second call returns measurement
   *
   * @param {number} screenX - Screen X coordinate of tap
   * @param {number} screenY - Screen Y coordinate of tap
   * @returns {Promise<Object>} Either startPointSet or measurement result
   */
  async measure(screenX, screenY) {
    if (!NativeAR || !this.isRunning) {
      throw new Error('AR session not active');
    }
    return await NativeAR.placeMeasurePoint(screenX, screenY);
  }

  /**
   * Reset current measurement (clear start point)
   */
  resetMeasurement() {
    if (NativeAR) NativeAR.resetMeasurement();
  }

  /**
   * Reset everything — tracking, planes, measurements
   */
  resetAll() {
    if (NativeAR) NativeAR.resetAll();
  }

  /**
   * Subscribe to AR events
   * @param {'measurement'|'status'|'plane'|'tracking'|'error'} event
   * @param {Function} callback
   */
  on(event, callback) {
    const eventMap = {
      measurement: 'onMeasurement',
      status: 'onARStatus',
      plane: 'onPlaneDetected',
      tracking: 'onTrackingStateChanged',
      error: 'onError',
    };

    const nativeEvent = eventMap[event];
    if (!nativeEvent || !eventEmitter) return;

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // ─── Private ─────────────────────────────────────────────────

  _setupEventListeners() {
    if (!eventEmitter) return;

    const events = [
      'onMeasurement',
      'onARStatus',
      'onPlaneDetected',
      'onTrackingStateChanged',
      'onError',
    ];

    const reverseMap = {
      onMeasurement: 'measurement',
      onARStatus: 'status',
      onPlaneDetected: 'plane',
      onTrackingStateChanged: 'tracking',
      onError: 'error',
    };

    events.forEach(nativeEvent => {
      const sub = eventEmitter.addListener(nativeEvent, (data) => {
        const event = reverseMap[nativeEvent];
        if (this.listeners[event]) {
          this.listeners[event].forEach(cb => cb(data));
        }
      });
      this.subscriptions.push(sub);
    });
  }

  _removeEventListeners() {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
  }
}

// ─── Helper: Measurement Flow ────────────────────────────────────

/**
 * Complete measurement flow helper
 * Guides user through measuring width, height, and depth
 *
 * Usage:
 *   const flow = new MeasurementFlow();
 *   flow.onProgress((step, total, label) => updateUI(step, total, label));
 *   flow.onComplete((measurements) => navigateToDesigner(measurements));
 *   await flow.start();
 *   // Then call flow.addPoint(x, y) on each tap
 */
export class MeasurementFlow {
  constructor() {
    this.session = new ARSession();
    this.measurements = { width: 0, height: 0, depth: 0 };
    this.currentDimension = 0;
    this.dimensions = [
      { key: 'width', label: 'Width', hint: 'Tap left wall, then right wall' },
      { key: 'height', label: 'Height', hint: 'Tap floor, then ceiling' },
      { key: 'depth', label: 'Depth', hint: 'Tap back wall, then front edge' },
    ];
    this._onProgress = null;
    this._onComplete = null;
    this._onError = null;
  }

  onProgress(cb) { this._onProgress = cb; return this; }
  onComplete(cb) { this._onComplete = cb; return this; }
  onError(cb) { this._onError = cb; return this; }

  async start() {
    try {
      await this.session.start();
      this._reportProgress();
    } catch (err) {
      if (this._onError) this._onError(err);
    }
  }

  async addPoint(screenX, screenY) {
    try {
      const result = await this.session.measure(screenX, screenY);

      if (result.status === 'measured') {
        const dim = this.dimensions[this.currentDimension];
        this.measurements[dim.key] = Math.round(result.distanceInches);

        this.currentDimension++;

        if (this.currentDimension >= this.dimensions.length) {
          this.session.stop();
          if (this._onComplete) this._onComplete(this.measurements);
        } else {
          this.session.resetMeasurement();
          this._reportProgress();
        }
      }

      return result;
    } catch (err) {
      if (this._onError) this._onError(err);
      throw err;
    }
  }

  stop() {
    this.session.stop();
  }

  get currentStep() {
    return this.dimensions[this.currentDimension] || null;
  }

  _reportProgress() {
    if (this._onProgress) {
      const dim = this.dimensions[this.currentDimension];
      this._onProgress(
        this.currentDimension + 1,
        this.dimensions.length,
        dim.label,
        dim.hint,
      );
    }
  }
}

// ─── Default Export ──────────────────────────────────────────────

export default {
  checkSupport: checkARSupport,
  ARSession,
  MeasurementFlow,
};
