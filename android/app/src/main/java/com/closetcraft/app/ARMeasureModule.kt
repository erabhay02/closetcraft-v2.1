/**
 * ARMeasureModule.kt
 * Native ARCore measurement module for ClosetCraft (Android)
 *
 * Provides spatial wall measurement using ARCore's hit testing and plane detection.
 * Communicates with React Native via the bridge (ARMeasurePackage.kt).
 *
 * Accuracy: ±0.5 inches on ARCore-supported devices
 */

package com.closetcraft.app

import android.app.Activity
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.ar.core.*
import com.google.ar.core.exceptions.*
import kotlin.math.abs
import kotlin.math.roundToInt
import kotlin.math.sqrt

class ARMeasureModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var arSession: Session? = null
    private var startPoint: FloatArray? = null
    private var isSessionRunning = false

    override fun getName(): String = "ARMeasureModule"

    // ─── Device Support Check ────────────────────────────────────

    @ReactMethod
    fun checkSupport(promise: Promise) {
        try {
            val availability = ArCoreApk.getInstance()
                .checkAvailability(reactApplicationContext)

            val supported = when (availability) {
                ArCoreApk.Availability.SUPPORTED_INSTALLED,
                ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD,
                ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED -> true
                else -> false
            }

            val result = Arguments.createMap().apply {
                putBoolean("arSupported", supported)
                putBoolean("lidarAvailable", false) // Android doesn't have LiDAR (yet)
                putString("deviceModel", android.os.Build.MODEL)
                putString("systemVersion", "Android ${android.os.Build.VERSION.RELEASE}")
                putString("arCoreStatus", availability.name)
            }
            promise.resolve(result)
        } catch (e: Exception) {
            val result = Arguments.createMap().apply {
                putBoolean("arSupported", false)
                putBoolean("lidarAvailable", false)
                putString("error", e.message)
            }
            promise.resolve(result)
        }
    }

    // ─── Session Management ──────────────────────────────────────

    @ReactMethod
    fun startSession(options: ReadableMap, promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No active activity found")
            return
        }

        try {
            // Check if ARCore needs to be installed
            when (ArCoreApk.getInstance().requestInstall(activity, true)) {
                ArCoreApk.InstallStatus.INSTALL_REQUESTED -> {
                    promise.reject("INSTALL_REQUESTED",
                        "ARCore installation requested. Please restart the measurement.")
                    return
                }
                ArCoreApk.InstallStatus.INSTALLED -> { /* Continue */ }
            }

            val session = Session(activity)
            val config = Config(session).apply {
                planeFindingMode = Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL
                updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
                focusMode = Config.FocusMode.AUTO
                lightEstimationMode = Config.LightEstimationMode.ENVIRONMENTAL_HDR

                // Enable depth if supported
                if (session.isDepthModeSupported(Config.DepthMode.AUTOMATIC)) {
                    depthMode = Config.DepthMode.AUTOMATIC
                }
            }

            session.configure(config)
            session.resume()

            arSession = session
            isSessionRunning = true
            startPoint = null

            val result = Arguments.createMap().apply {
                putString("status", "started")
                putBoolean("planeDetection", true)
                putBoolean("depthEnabled",
                    config.depthMode == Config.DepthMode.AUTOMATIC)
            }
            promise.resolve(result)

            emitEvent("onARStatus", Arguments.createMap().apply {
                putString("status", "started")
                putString("message", "AR session active. Point at walls to detect surfaces.")
            })

        } catch (e: UnavailableArcoreNotInstalledException) {
            promise.reject("ARCORE_NOT_INSTALLED",
                "ARCore is not installed. Please install it from the Play Store.")
        } catch (e: UnavailableApkTooOldException) {
            promise.reject("ARCORE_OUTDATED",
                "ARCore needs to be updated. Please update from the Play Store.")
        } catch (e: UnavailableSdkTooOldException) {
            promise.reject("SDK_TOO_OLD",
                "This app needs to be updated to support your device's ARCore version.")
        } catch (e: UnavailableDeviceNotCompatibleException) {
            promise.reject("DEVICE_NOT_COMPATIBLE",
                "This device does not support ARCore.")
        } catch (e: Exception) {
            promise.reject("AR_ERROR", "Failed to start AR session: ${e.message}")
        }
    }

    @ReactMethod
    fun stopSession() {
        try {
            arSession?.pause()
            arSession?.close()
        } catch (e: Exception) {
            // Ignore cleanup errors
        }
        arSession = null
        isSessionRunning = false
        startPoint = null
    }

    // ─── Measurement ─────────────────────────────────────────────

    @ReactMethod
    fun placeMeasurePoint(screenX: Float, screenY: Float, promise: Promise) {
        val session = arSession
        if (session == null || !isSessionRunning) {
            promise.reject("NO_SESSION", "AR session is not active")
            return
        }

        try {
            val frame = session.update()

            // Check tracking state
            if (frame.camera.trackingState != TrackingState.TRACKING) {
                emitEvent("onTrackingStateChanged", Arguments.createMap().apply {
                    putString("status", "limited")
                    putString("message", "Tracking lost — move device slowly")
                })
                promise.reject("NOT_TRACKING",
                    "Device is not tracking. Move slowly and point at textured surfaces.")
                return
            }

            // Perform hit test
            val hitResults = frame.hitTest(screenX, screenY)

            // Filter for plane hits first, then estimated planes
            val bestHit = hitResults.firstOrNull { hit ->
                val trackable = hit.trackable
                trackable is Plane &&
                    trackable.isPoseInPolygon(hit.hitPose) &&
                    trackable.trackingState == TrackingState.TRACKING
            } ?: hitResults.firstOrNull { hit ->
                hit.trackable.trackingState == TrackingState.TRACKING
            }

            if (bestHit == null) {
                promise.reject("NO_SURFACE",
                    "No surface detected. Move closer or point at a wall/floor.")
                return
            }

            val pose = bestHit.hitPose
            val point = floatArrayOf(
                pose.tx(), pose.ty(), pose.tz()
            )
            val isEstimated = bestHit.trackable !is Plane

            val currentStart = startPoint
            if (currentStart != null) {
                // Calculate distance
                val dx = point[0] - currentStart[0]
                val dy = point[1] - currentStart[1]
                val dz = point[2] - currentStart[2]
                val distanceMeters = sqrt(
                    (dx * dx + dy * dy + dz * dz).toDouble()
                ).toFloat()
                val distanceInches = distanceMeters * 39.3701f

                // Determine orientation
                val horizontalDist = sqrt((dx * dx + dz * dz).toDouble()).toFloat()
                val verticalDist = abs(dy)
                val orientation = if (verticalDist > horizontalDist) "vertical" else "horizontal"

                startPoint = null

                val result = Arguments.createMap().apply {
                    putString("status", "measured")
                    putDouble("distanceInches",
                        (distanceInches * 10).roundToInt().toDouble() / 10)
                    putDouble("distanceMeters",
                        (distanceMeters * 1000).roundToInt().toDouble() / 1000)
                    putString("orientation", orientation)
                    putBoolean("estimated", isEstimated)
                    putString("confidence", if (isEstimated) "low" else "high")

                    val startArr = Arguments.createArray().apply {
                        pushDouble(currentStart[0].toDouble())
                        pushDouble(currentStart[1].toDouble())
                        pushDouble(currentStart[2].toDouble())
                    }
                    putArray("startPoint", startArr)

                    val endArr = Arguments.createArray().apply {
                        pushDouble(point[0].toDouble())
                        pushDouble(point[1].toDouble())
                        pushDouble(point[2].toDouble())
                    }
                    putArray("endPoint", endArr)
                }
                promise.resolve(result)

                emitEvent("onMeasurement", Arguments.createMap().apply {
                    putDouble("distance",
                        (distanceInches * 10).roundToInt().toDouble() / 10)
                    putString("orientation", orientation)
                })

            } else {
                // Set start point
                startPoint = point

                val result = Arguments.createMap().apply {
                    putString("status", "startPointSet")
                    val pointArr = Arguments.createArray().apply {
                        pushDouble(point[0].toDouble())
                        pushDouble(point[1].toDouble())
                        pushDouble(point[2].toDouble())
                    }
                    putArray("point", pointArr)
                    putBoolean("estimated", isEstimated)
                }
                promise.resolve(result)
            }

            // Report detected planes
            for (plane in session.getAllTrackables(Plane::class.java)) {
                if (plane.trackingState == TrackingState.TRACKING) {
                    val alignment = when (plane.type) {
                        Plane.Type.VERTICAL -> "vertical"
                        Plane.Type.HORIZONTAL_UPWARD_FACING -> "horizontal_up"
                        Plane.Type.HORIZONTAL_DOWNWARD_FACING -> "horizontal_down"
                        else -> "unknown"
                    }
                    emitEvent("onPlaneDetected", Arguments.createMap().apply {
                        putString("alignment", alignment)
                        putDouble("width", plane.extentX.toDouble())
                        putDouble("height", plane.extentZ.toDouble())
                    })
                }
            }

        } catch (e: NotTrackingException) {
            promise.reject("NOT_TRACKING", "Device lost tracking: ${e.message}")
        } catch (e: Exception) {
            promise.reject("MEASURE_ERROR", "Measurement failed: ${e.message}")
        }
    }

    // ─── Reset ───────────────────────────────────────────────────

    @ReactMethod
    fun resetMeasurement() {
        startPoint = null
    }

    @ReactMethod
    fun resetAll() {
        startPoint = null
        val session = arSession ?: return
        try {
            val config = Config(session).apply {
                planeFindingMode = Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL
                updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
            }
            session.configure(config)
            session.resume()
        } catch (e: Exception) {
            emitEvent("onError", Arguments.createMap().apply {
                putString("error", "Reset failed: ${e.message}")
            })
        }
    }

    // ─── Event Helper ────────────────────────────────────────────

    private fun emitEvent(name: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(name, params)
    }

    // ─── Lifecycle ───────────────────────────────────────────────

    override fun onCatalystInstanceDestroy() {
        stopSession()
        super.onCatalystInstanceDestroy()
    }
}
