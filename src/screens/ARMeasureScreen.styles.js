import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  backBtn: {
    marginBottom: 20,
  },
  backBtnText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 14,
  },

  // Permission
  permissionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    flex: 1,
  },
  permTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  permDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 320,
  },

  // How it works
  howItWorks: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  howStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  howStepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  howStepNumText: {
    color: COLORS.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  howStepText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

  // Reference cards
  refCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  refCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.bgElevated,
  },
  refCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  refCardSize: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Accuracy note
  accuracyNote: {
    backgroundColor: 'rgba(107,142,158,0.08)',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(107,142,158,0.15)',
    marginTop: 20,
    marginBottom: 24,
  },
  accuracyTitle: {
    color: COLORS.blue,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  accuracyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  secondaryBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: 8,
  },
  secondaryBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Camera
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraTopBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingBottom: 16,
  },
  cameraBackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraTip: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  guideFrame: {
    width: SCREEN_W * 0.85,
    height: SCREEN_H * 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.gold,
  },
  guideTopLeft: {
    top: 0, left: 0,
    borderTopWidth: 3, borderLeftWidth: 3,
  },
  guideTopRight: {
    top: 0, right: 0,
    borderTopWidth: 3, borderRightWidth: 3,
  },
  guideBottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: 3, borderLeftWidth: 3,
  },
  guideBottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: 3, borderRightWidth: 3,
  },
  guideText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  cameraBottomBar: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 20,
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureBtnInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },

  // Photo measurement
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  capturedPhoto: {
    width: '100%',
    height: '100%',
  },
  measureDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refDot: {
    backgroundColor: 'rgba(226,185,127,0.8)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  mDot: {
    backgroundColor: 'rgba(123,158,107,0.8)',
    borderWidth: 2,
    borderColor: '#fff',
  },
  dotLabel: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
  measureLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: COLORS.gold,
  },
  measureInstructionBar: {
    backgroundColor: COLORS.bgCard,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  measureInstructionTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  measureInstructionSub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  measureProgress: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  retakeBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  retakeBtnText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  // Results
  resultsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultLabel: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  resultValue: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
