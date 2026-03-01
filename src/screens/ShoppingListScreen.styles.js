import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  backBtn: { width: 60 },
  backBtnText: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  headerTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  checkAllBtn: { width: 70, alignItems: 'flex-end' },
  checkAllText: { color: COLORS.gold, fontSize: 13, fontWeight: '600' },
  progressBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingBottom: 10,
  },
  progressTrack: {
    flex: 1, height: 4, backgroundColor: COLORS.bgElevated,
    borderRadius: 2, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 2 },
  progressText: { color: COLORS.textMuted, fontSize: 12, width: 60, textAlign: 'right' },
  listContent: { padding: 16, paddingBottom: 24 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, paddingHorizontal: 4, marginTop: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  sectionTitle: { color: COLORS.gold, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCount: { color: COLORS.textMuted, fontSize: 12 },
  item: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border + '60', gap: 12,
  },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkboxMark: { color: '#fff', fontSize: 12, fontWeight: '800' },
  itemInfo: { flex: 1 },
  itemLabel: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600', marginBottom: 2 },
  itemLabelChecked: { color: COLORS.textMuted, textDecorationLine: 'line-through' },
  itemMeta: { color: COLORS.textMuted, fontSize: 11 },
  itemRight: { alignItems: 'flex-end', gap: 6 },
  itemPrice: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700' },
  retailerBtns: { flexDirection: 'row', gap: 4 },
  retailerBtn: {
    backgroundColor: COLORS.bgElevated, borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 3,
    borderWidth: 1, borderColor: COLORS.border,
  },
  retailerBtnText: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700' },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },
  footer: { paddingTop: 16, gap: 8 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderTopWidth: 2, borderTopColor: COLORS.border,
  },
  totalLabel: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  totalValue: { color: COLORS.gold, fontSize: 18, fontWeight: '800' },
  disclaimer: { color: COLORS.textMuted, fontSize: 11, lineHeight: 15 },
  exportBar: {
    flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  exportBtn: {
    flex: 1, backgroundColor: COLORS.gold, borderRadius: 12,
    paddingVertical: 13, alignItems: 'center', justifyContent: 'center',
  },
  exportBtnDisabled: { opacity: 0.5 },
  exportBtnText: { color: '#1a1a2e', fontWeight: '800', fontSize: 14 },
  exportBtnOutline: {
    backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.borderActive,
  },
  exportBtnOutlineText: { color: COLORS.gold, fontWeight: '700', fontSize: 14 },
});
