import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width: SW, height: SH } = Dimensions.get('window');

export { SW, SH };

export default StyleSheet.create({
  container: { backgroundColor: 'rgba(0,0,0,0.35)', borderLeftWidth: 1, borderLeftColor: COLORS.border, width: 360 },
  fullscreen: { position: 'absolute', inset: 0, width: '100%', zIndex: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontWeight: '700', color: COLORS.text, fontSize: 13 },
  viewBtns: { flexDirection: 'row', gap: 4 },
  viewBtn: { padding: 4, paddingHorizontal: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.04)' },
  viewBtnActive: { backgroundColor: COLORS.goldMuted },
  viewBtnText: { fontSize: 14 },
  canvasWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 8 },
  zoomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 8 },
  zoomBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  zoomText: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  zoomLabel: { color: COLORS.textSec, fontSize: 12, fontWeight: '600', minWidth: 40, textAlign: 'center' },
  infoText: { textAlign: 'center', color: COLORS.textMut, fontSize: 10, paddingBottom: 12 },
});
