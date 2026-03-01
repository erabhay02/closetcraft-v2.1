/**
 * AR Measurement Screen
 * 
 * Uses the device camera + motion sensors to estimate wall measurements.
 * 
 * HOW IT WORKS:
 * This is a "guided photo measurement" approach that works on ALL devices
 * (no ARKit/ARCore dependency). The user:
 * 
 * 1. Places a reference object of known size (credit card, dollar bill, etc.)
 *    against the wall for scale calibration
 * 2. Takes a photo of the wall
 * 3. Taps two points on the photo to define the measurement
 * 4. The app calculates real-world distance using the reference object scale
 * 
 * For devices WITH ARKit/ARCore support, a native module can be added
 * for true spatial measurement (see docs/AR_NATIVE_MODULE.md).
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS, inToDisplay } from '../utils/constants';
import styles from './ARMeasureScreen.styles';

// Known reference objects (width in inches)
const REFERENCE_OBJECTS = [
  { id: 'credit-card', label: 'Credit Card', widthIn: 3.375, heightIn: 2.125, icon: '💳' },
  { id: 'dollar-bill', label: 'US Dollar Bill', widthIn: 6.14, heightIn: 2.61, icon: '💵' },
  { id: 'letter-paper', label: 'Letter Paper (8.5×11)', widthIn: 8.5, heightIn: 11, icon: '📄' },
  { id: 'iphone', label: 'iPhone (any model)', widthIn: 2.82, heightIn: 5.78, icon: '📱' },
  { id: 'custom', label: 'Custom Object', widthIn: 0, heightIn: 0, icon: '📏' },
];

const MEASUREMENT_LABELS = ['Width', 'Height', 'Depth'];

export default function ARMeasureScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState('intro'); // intro | reference | capture | measure | results
  const [referenceObj, setReferenceObj] = useState(null);
  const [customRefSize, setCustomRefSize] = useState({ w: 6, h: 4 });
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [measurePoints, setMeasurePoints] = useState([]);
  const [refPoints, setRefPoints] = useState([]);
  const [currentMeasurement, setCurrentMeasurement] = useState(0); // 0=width, 1=height, 2=depth
  const [measurements, setMeasurements] = useState({ width: 0, height: 0, depth: 0 });
  const [pixelsPerInch, setPixelsPerInch] = useState(null);
  const cameraRef = useRef(null);

  // ─── Capture Photo ─────────────────────────────────────────────
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      setCapturedPhoto(photo);
      setStep('calibrate');
    } catch (err) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  // ─── Handle Photo Taps ────────────────────────────────────────
  const handlePhotoTap = useCallback((event) => {
    const { locationX, locationY } = event.nativeEvent;
    const point = { x: locationX, y: locationY };

    if (step === 'calibrate') {
      // Calibrating: user taps two ends of reference object
      const newRefPoints = [...refPoints, point];
      setRefPoints(newRefPoints);

      if (newRefPoints.length === 2) {
        // Calculate pixels per inch from reference object
        const dx = newRefPoints[1].x - newRefPoints[0].x;
        const dy = newRefPoints[1].y - newRefPoints[0].y;
        const pixelDist = Math.sqrt(dx * dx + dy * dy);
        const refWidthIn = referenceObj.widthIn;
        const ppi = pixelDist / refWidthIn;
        setPixelsPerInch(ppi);
        setStep('measure');
      }
    } else if (step === 'measure') {
      // Measuring: user taps two points on the wall
      const newMeasurePoints = [...measurePoints, point];
      setMeasurePoints(newMeasurePoints);

      if (newMeasurePoints.length === 2) {
        // Calculate real distance
        const dx = newMeasurePoints[1].x - newMeasurePoints[0].x;
        const dy = newMeasurePoints[1].y - newMeasurePoints[0].y;
        const pixelDist = Math.sqrt(dx * dx + dy * dy);
        const realInches = Math.round(pixelDist / pixelsPerInch);

        const key = ['width', 'height', 'depth'][currentMeasurement];
        const newMeasurements = { ...measurements, [key]: realInches };
        setMeasurements(newMeasurements);
        setMeasurePoints([]);

        if (currentMeasurement < 2) {
          setCurrentMeasurement(currentMeasurement + 1);
          Alert.alert(
            `${MEASUREMENT_LABELS[currentMeasurement]} Measured!`,
            `${inToDisplay(realInches)} recorded. Now measure the ${MEASUREMENT_LABELS[currentMeasurement + 1].toLowerCase()}.`,
            [
              { text: 'Retake Photo', onPress: () => { setCapturedPhoto(null); setStep('capture'); } },
              { text: 'Continue', style: 'default' },
            ]
          );
        } else {
          setStep('results');
        }
      }
    }
  }, [step, refPoints, measurePoints, pixelsPerInch, referenceObj, currentMeasurement, measurements]);

  // ─── Permission Check ──────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera access...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionCard}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📷</Text>
          <Text style={styles.permTitle}>Camera Access Needed</Text>
          <Text style={styles.permDesc}>
            ClosetCraft needs camera access to photograph your closet walls for measurement.
            Your photos stay on your device.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryBtnText}>Use Manual Measurements Instead</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Render Intro ──────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.screenTitle}>📷 Camera Measure</Text>
          <Text style={styles.screenSubtitle}>
            Measure your closet walls using your phone camera and a reference object for scale.
          </Text>

          {/* How it works */}
          <View style={styles.howItWorks}>
            <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
            {[
              { num: '1', text: 'Choose a reference object of known size (credit card, dollar bill, etc.)' },
              { num: '2', text: 'Place it against the wall and take a photo' },
              { num: '3', text: 'Tap both ends of the reference object to calibrate scale' },
              { num: '4', text: 'Tap two points to measure each dimension (width, height, depth)' },
            ].map((s, i) => (
              <View key={i} style={styles.howStep}>
                <View style={styles.howStepNum}>
                  <Text style={styles.howStepNumText}>{s.num}</Text>
                </View>
                <Text style={styles.howStepText}>{s.text}</Text>
              </View>
            ))}
          </View>

          {/* Reference Object Selection */}
          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>SELECT REFERENCE OBJECT</Text>
          {REFERENCE_OBJECTS.filter(r => r.id !== 'custom').map(ref => (
            <TouchableOpacity
              key={ref.id}
              style={[
                styles.refCard,
                referenceObj?.id === ref.id && styles.refCardActive,
              ]}
              onPress={() => setReferenceObj(ref)}
            >
              <Text style={{ fontSize: 28 }}>{ref.icon}</Text>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.refCardTitle}>{ref.label}</Text>
                <Text style={styles.refCardSize}>
                  {ref.widthIn}" × {ref.heightIn}"
                </Text>
              </View>
              {referenceObj?.id === ref.id && (
                <Text style={{ fontSize: 20 }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Accuracy Note */}
          <View style={styles.accuracyNote}>
            <Text style={styles.accuracyTitle}>📐 Accuracy Note</Text>
            <Text style={styles.accuracyText}>
              Photo-based measurement is typically accurate to ±2 inches. For best results,
              hold your phone parallel to the wall and keep the reference object flat against
              the surface. For precise measurements, we recommend verifying with a tape measure.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, !referenceObj && styles.btnDisabled]}
            disabled={!referenceObj}
            onPress={() => setStep('capture')}
          >
            <Text style={styles.primaryBtnText}>Open Camera →</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ─── Render Camera ─────────────────────────────────────────────
  if (step === 'capture') {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        >
          {/* Camera overlay */}
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraTopBar}>
              <TouchableOpacity onPress={() => setStep('intro')}>
                <Text style={styles.cameraBackText}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.cameraTip}>
                Place {referenceObj?.label} against the wall
              </Text>
            </View>

            {/* Guide frame */}
            <View style={styles.guideFrame}>
              <View style={[styles.guideCorner, styles.guideTopLeft]} />
              <View style={[styles.guideCorner, styles.guideTopRight]} />
              <View style={[styles.guideCorner, styles.guideBottomLeft]} />
              <View style={[styles.guideCorner, styles.guideBottomRight]} />
              <Text style={styles.guideText}>
                Position wall inside frame
              </Text>
            </View>

            {/* Capture button */}
            <View style={styles.cameraBottomBar}>
              <TouchableOpacity style={styles.captureBtn} onPress={takePhoto}>
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  // ─── Render Calibrate / Measure ─────────────────────────────────
  if ((step === 'calibrate' || step === 'measure') && capturedPhoto) {
    const isCalibrating = step === 'calibrate';
    return (
      <View style={styles.cameraContainer}>
        {/* Photo with touch overlay */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handlePhotoTap}
          style={styles.photoContainer}
        >
          <Image
            source={{ uri: capturedPhoto.uri }}
            style={styles.capturedPhoto}
            resizeMode="contain"
          />

          {/* Draw reference points */}
          {refPoints.map((pt, i) => (
            <View key={`ref-${i}`} style={[styles.measureDot, styles.refDot, { left: pt.x - 10, top: pt.y - 10 }]}>
              <Text style={styles.dotLabel}>R{i + 1}</Text>
            </View>
          ))}

          {/* Draw line between reference points */}
          {refPoints.length === 2 && (
            <View style={[styles.measureLine, {
              left: Math.min(refPoints[0].x, refPoints[1].x),
              top: (refPoints[0].y + refPoints[1].y) / 2 - 1,
              width: Math.abs(refPoints[1].x - refPoints[0].x),
              transform: [{ rotate: `${Math.atan2(refPoints[1].y - refPoints[0].y, refPoints[1].x - refPoints[0].x)}rad` }],
            }]} />
          )}

          {/* Draw measure points */}
          {measurePoints.map((pt, i) => (
            <View key={`m-${i}`} style={[styles.measureDot, styles.mDot, { left: pt.x - 10, top: pt.y - 10 }]}>
              <Text style={styles.dotLabel}>M{i + 1}</Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* Instruction bar */}
        <View style={styles.measureInstructionBar}>
          {isCalibrating ? (
            <>
              <Text style={styles.measureInstructionTitle}>
                📐 Calibrate: Tap both ends of your {referenceObj?.label}
              </Text>
              <Text style={styles.measureInstructionSub}>
                {refPoints.length === 0 ? 'Tap the LEFT edge' :
                 refPoints.length === 1 ? 'Now tap the RIGHT edge' :
                 'Calibration complete!'}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.measureInstructionTitle}>
                📏 Measure: {MEASUREMENT_LABELS[currentMeasurement]}
              </Text>
              <Text style={styles.measureInstructionSub}>
                {measurePoints.length === 0
                  ? `Tap the start point for ${MEASUREMENT_LABELS[currentMeasurement].toLowerCase()}`
                  : `Tap the end point for ${MEASUREMENT_LABELS[currentMeasurement].toLowerCase()}`}
              </Text>
              <Text style={styles.measureProgress}>
                {currentMeasurement + 1} of 3 measurements
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => {
              setCapturedPhoto(null);
              setRefPoints([]);
              setMeasurePoints([]);
              setPixelsPerInch(null);
              setStep('capture');
            }}
          >
            <Text style={styles.retakeBtnText}>📷 Retake Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── Render Results ────────────────────────────────────────────
  if (step === 'results') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.screenTitle}>✅ Measurements Complete</Text>
          <Text style={styles.screenSubtitle}>
            Review your measurements and proceed to design
          </Text>

          <View style={styles.resultsCard}>
            {['width', 'height', 'depth'].map((key, i) => (
              <View key={key} style={styles.resultRow}>
                <Text style={styles.resultLabel}>{MEASUREMENT_LABELS[i]}</Text>
                <Text style={styles.resultValue}>{inToDisplay(measurements[key])}</Text>
              </View>
            ))}
          </View>

          <View style={styles.accuracyNote}>
            <Text style={styles.accuracyTitle}>⚠️ Verify Measurements</Text>
            <Text style={styles.accuracyText}>
              We recommend double-checking these measurements with a tape measure
              before purchasing materials. Camera measurements are estimates.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              // Navigate back with measurements
              if (route.params?.onMeasured) {
                route.params.onMeasured(measurements);
              }
              navigation.goBack();
            }}
          >
            <Text style={styles.primaryBtnText}>Use These Measurements →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { marginTop: 12 }]}
            onPress={() => {
              setStep('intro');
              setMeasurements({ width: 0, height: 0, depth: 0 });
              setRefPoints([]);
              setMeasurePoints([]);
              setPixelsPerInch(null);
              setCapturedPhoto(null);
              setCurrentMeasurement(0);
            }}
          >
            <Text style={styles.secondaryBtnText}>Retake All Measurements</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return null;
}
