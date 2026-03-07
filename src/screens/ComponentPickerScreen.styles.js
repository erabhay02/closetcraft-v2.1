import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 60 },
  backBtnText: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  headerTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  doneBtn: { width: 60, alignItems: 'flex-end' },
  doneBtnText: { color: COLORS.gold, fontSize: 15, fontWeight: '700' },
  categoryBar: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  categoryContent: {
    paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row',
  },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.goldMuted, borderColor: COLORS.borderActive,
  },
  categoryChipIcon: { fontSize: 14 },
  categoryChipText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '600' },
  categoryChipTextActive: { color: COLORS.gold },
  list: { padding: 16, gap: 8, paddingBottom: 40 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: COLORS.border, gap: 12,
  },
  itemIcon: { fontSize: 26, width: 36, textAlign: 'center' },
  itemInfo: { flex: 1 },
  itemLabel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  itemDesc: { color: COLORS.textSecondary, fontSize: 11, lineHeight: 15 },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  counterBtnText: { color: COLORS.gold, fontSize: 18, fontWeight: '700', lineHeight: 22 },
  counterValue: {
    color: COLORS.textPrimary, fontSize: 16, fontWeight: '700',
    width: 24, textAlign: 'center',
  },
});
