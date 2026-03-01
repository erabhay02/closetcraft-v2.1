import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width: SW, height: SH } = Dimensions.get('window');

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.textSec, textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 300 },

  primaryBtn: { backgroundColor: COLORS.gold, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 36, width: '100%', alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: COLORS.bg, fontSize: 16, fontWeight: '700' },
  secondaryBtn: { paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center' },
  secondaryBtnText: { color: COLORS.textSec, fontSize: 14, fontWeight: '600' },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: 'rgba(0,0,0,0.3)' },
  trackingBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  trackingDot: { width: 8, height: 8, borderRadius: 4 },
  trackingText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  scanOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanLine: { position: 'absolute', left: 20, right: 20, height: 2, backgroundColor: COLORS.gold, opacity: 0.6 },
  scanText: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  scanSubtext: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },

  crosshair: { position: 'absolute', top: SH / 2 - 12, left: SW / 2 - 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  crosshairLine: { position: 'absolute', backgroundColor: COLORS.gold, borderRadius: 1 },

  progressBar: { position: 'absolute', top: 110, left: 16, right: 16, flexDirection: 'row', gap: 8 },
  progressStep: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 10, alignItems: 'center', opacity: 0.5 },
  progressStepDone: { opacity: 1, backgroundColor: 'rgba(123,158,107,0.3)' },
  progressStepActive: { opacity: 1, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: 'rgba(226,185,127,0.4)' },
  progressIcon: { fontSize: 18, opacity: 0.4 },
  progressLabel: { color: '#fff', fontSize: 11, fontWeight: '600', marginTop: 2 },
  progressValue: { color: COLORS.gold, fontSize: 13, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 20, paddingBottom: 40, alignItems: 'center' },
  stepIndicator: { borderRadius: 8, paddingVertical: 6, paddingHorizontal: 16, marginBottom: 8 },
  stepLabel: { fontSize: 15, fontWeight: '700' },
  hintText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 4 },
  stepCount: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },

  resultsCard: { width: '100%', backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resultLabel: { color: COLORS.textSec, fontSize: 15, fontWeight: '600' },
  resultValue: { fontSize: 24, fontWeight: '700', fontVariant: ['tabular-nums'] },
  confidenceRow: { marginBottom: 20 },
});
