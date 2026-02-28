# AR Native Module Integration Guide

## Overview

ClosetCraft Phase 2 ships with a **photo-based measurement** system that works on ALL
devices. For devices that support ARKit (iOS) or ARCore (Android), you can add true
spatial measurement for real-time, hands-free wall measurement.

This document explains how to integrate native AR measurement modules.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              React Native App                     │
│                                                   │
│  ┌───────────────┐    ┌───────────────────────┐  │
│  │ Photo Measure  │    │  AR Measure (Native)  │  │
│  │ (works on all) │    │  (ARKit / ARCore)     │  │
│  └───────────────┘    └───────────────────────┘  │
│           │                       │               │
│           └───────┬───────────────┘               │
│                   │                               │
│          ┌────────▼────────┐                      │
│          │ MeasurementAPI   │                      │
│          │ (unified interface)                     │
│          └─────────────────┘                      │
│                   │                               │
│          ┌────────▼────────┐                      │
│          │  Designer Canvas │                      │
│          └─────────────────┘                      │
└─────────────────────────────────────────────────┘
```

---

## iOS: ARKit Integration

### Prerequisites
- iPhone 6s or later (A9 chip+)
- iOS 11.0+
- Xcode 15+

### Step 1: Create Native Module

Create `ios/ClosetCraftAR/ARMeasureModule.swift`:

```swift
import ARKit
import React

@objc(ARMeasureModule)
class ARMeasureModule: RCTEventEmitter {
    
    private var arSession: ARSession?
    private var startPoint: SCNVector3?
    private var measurements: [String: Float] = [:]
    
    override func supportedEvents() -> [String] {
        return ["onMeasurement", "onARStatus", "onPlaneDetected"]
    }
    
    @objc func isSupported(_ resolve: @escaping RCTPromiseResolveBlock, 
                           rejecter reject: RCTPromiseRejectBlock) {
        resolve(ARWorldTrackingConfiguration.isSupported)
    }
    
    @objc func startSession(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard ARWorldTrackingConfiguration.isSupported else {
            reject("AR_NOT_SUPPORTED", "ARKit is not supported on this device", nil)
            return
        }
        
        let config = ARWorldTrackingConfiguration()
        config.planeDetection = [.vertical, .horizontal]
        config.environmentTexturing = .automatic
        
        arSession = ARSession()
        arSession?.run(config)
        
        resolve(true)
    }
    
    @objc func placeMeasurePoint(_ screenX: Float, screenY: Float,
                                  resolve: @escaping RCTPromiseResolveBlock,
                                  rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let session = arSession,
              let frame = session.currentFrame else {
            reject("NO_SESSION", "AR session not active", nil)
            return
        }
        
        // Perform raycast from screen point
        let screenPoint = CGPoint(x: CGFloat(screenX), y: CGFloat(screenY))
        
        if let query = frame.raycastQuery(from: screenPoint, 
                                           allowing: .existingPlaneGeometry, 
                                           alignment: .any) {
            let results = session.raycast(query)
            
            if let result = results.first {
                let position = SCNVector3(
                    result.worldTransform.columns.3.x,
                    result.worldTransform.columns.3.y,
                    result.worldTransform.columns.3.z
                )
                
                if let start = startPoint {
                    // Calculate distance
                    let distance = sqrt(
                        pow(position.x - start.x, 2) +
                        pow(position.y - start.y, 2) +
                        pow(position.z - start.z, 2)
                    )
                    
                    // Convert meters to inches
                    let distanceInches = distance * 39.3701
                    
                    startPoint = nil
                    resolve([
                        "distance": distanceInches,
                        "startPoint": [start.x, start.y, start.z],
                        "endPoint": [position.x, position.y, position.z],
                    ])
                } else {
                    startPoint = position
                    resolve([
                        "status": "startPointSet",
                        "point": [position.x, position.y, position.z],
                    ])
                }
            } else {
                reject("NO_SURFACE", "No surface detected at that point", nil)
            }
        }
    }
    
    @objc func stopSession() {
        arSession?.pause()
        arSession = nil
        startPoint = nil
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
```

### Step 2: Bridge Header

Create `ios/ClosetCraftAR/ARMeasureModule.m`:

```objc
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ARMeasureModule, RCTEventEmitter)

RCT_EXTERN_METHOD(isSupported:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startSession:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(placeMeasurePoint:(float)screenX 
                  screenY:(float)screenY
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopSession)

@end
```

---

## Android: ARCore Integration

### Prerequisites
- ARCore-compatible device (most phones since 2018)
- Android 7.0+ (API 24+)

### Step 1: Add ARCore Dependency

In `android/app/build.gradle`:

```gradle
dependencies {
    implementation 'com.google.ar:core:1.41.0'
    implementation 'com.google.ar.sceneform.ux:sceneform-ux:1.17.1'
}
```

### Step 2: Create Native Module

Create `android/app/src/main/.../ARMeasureModule.java`:

```java
package com.closetcraft.app;

import com.facebook.react.bridge.*;
import com.google.ar.core.*;
import android.opengl.Matrix;
import java.util.Collection;

public class ARMeasureModule extends ReactContextBaseJavaModule {
    
    private Session arSession;
    private float[] startPoint;
    
    public ARMeasureModule(ReactApplicationContext context) {
        super(context);
    }
    
    @Override
    public String getName() {
        return "ARMeasureModule";
    }
    
    @ReactMethod
    public void isSupported(Promise promise) {
        try {
            ArCoreApk.Availability availability = 
                ArCoreApk.getInstance().checkAvailability(getReactApplicationContext());
            promise.resolve(
                availability == ArCoreApk.Availability.SUPPORTED_INSTALLED ||
                availability == ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD ||
                availability == ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED
            );
        } catch (Exception e) {
            promise.resolve(false);
        }
    }
    
    @ReactMethod
    public void startSession(Promise promise) {
        try {
            arSession = new Session(getCurrentActivity());
            Config config = new Config(arSession);
            config.setPlaneFindingMode(Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL);
            arSession.configure(config);
            arSession.resume();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("AR_ERROR", "Failed to start AR session: " + e.getMessage());
        }
    }
    
    @ReactMethod 
    public void placeMeasurePoint(float screenX, float screenY, Promise promise) {
        if (arSession == null) {
            promise.reject("NO_SESSION", "AR session not active");
            return;
        }
        
        try {
            Frame frame = arSession.update();
            java.util.List<HitResult> hits = frame.hitTest(screenX, screenY);
            
            if (!hits.isEmpty()) {
                HitResult hit = hits.get(0);
                Pose pose = hit.getHitPose();
                float[] point = pose.getTranslation();
                
                if (startPoint != null) {
                    float dx = point[0] - startPoint[0];
                    float dy = point[1] - startPoint[1];
                    float dz = point[2] - startPoint[2];
                    float distance = (float) Math.sqrt(dx*dx + dy*dy + dz*dz);
                    float distanceInches = distance * 39.3701f;
                    
                    WritableMap result = Arguments.createMap();
                    result.putDouble("distance", distanceInches);
                    startPoint = null;
                    promise.resolve(result);
                } else {
                    startPoint = point;
                    WritableMap result = Arguments.createMap();
                    result.putString("status", "startPointSet");
                    promise.resolve(result);
                }
            } else {
                promise.reject("NO_SURFACE", "No surface detected");
            }
        } catch (Exception e) {
            promise.reject("MEASURE_ERROR", e.getMessage());
        }
    }
    
    @ReactMethod
    public void stopSession() {
        if (arSession != null) {
            arSession.pause();
            arSession.close();
            arSession = null;
        }
        startPoint = null;
    }
}
```

---

## React Native Bridge (Shared)

Create `src/utils/arBridge.js`:

```javascript
import { NativeModules, Platform } from 'react-native';

const { ARMeasureModule } = NativeModules;

export const ARBridge = {
  async isSupported() {
    if (!ARMeasureModule) return false;
    try {
      return await ARMeasureModule.isSupported();
    } catch {
      return false;
    }
  },

  async startSession() {
    if (!ARMeasureModule) throw new Error('AR not available');
    return await ARMeasureModule.startSession();
  },

  async measurePoint(screenX, screenY) {
    if (!ARMeasureModule) throw new Error('AR not available');
    return await ARMeasureModule.placeMeasurePoint(screenX, screenY);
  },

  stopSession() {
    if (ARMeasureModule) {
      ARMeasureModule.stopSession();
    }
  },
};
```

---

## Usage in App

```javascript
import { ARBridge } from '../utils/arBridge';

// Check if true AR is available
const hasAR = await ARBridge.isSupported();

if (hasAR) {
  // Use native AR measurement
  await ARBridge.startSession();
  // ... user taps screen to measure
  const result = await ARBridge.measurePoint(touchX, touchY);
  if (result.distance) {
    console.log(`Measured: ${result.distance} inches`);
  }
} else {
  // Fall back to photo-based measurement
  navigation.navigate('ARMeasure'); // Uses the photo-based screen
}
```

---

## Accuracy Comparison

| Method              | Accuracy  | Device Requirement     | User Effort |
|---------------------|-----------|------------------------|-------------|
| Photo + Reference   | ±2-3 in   | Any camera phone       | Medium      |
| ARKit (iOS)         | ±0.5 in   | iPhone 6s+             | Low         |
| ARCore (Android)    | ±0.5 in   | ARCore-compatible      | Low         |
| Manual (tape)       | ±0.25 in  | Tape measure           | High        |

---

## Testing

1. Test photo-based measurement on both platforms
2. Test AR module on physical devices (AR doesn't work in simulators)
3. Verify graceful fallback when AR is not available
4. Test measurement accuracy against known dimensions
5. Test in various lighting conditions
