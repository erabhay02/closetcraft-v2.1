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
  scroll: { padding: 16, gap: 12, paddingBottom: 48 },
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  toggle: {
    flexDirection: 'row', backgroundColor: COLORS.bg, borderRadius: 10, padding: 4,
  },
  toggleOption: {
    flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 7,
  },
  toggleOptionActive: { backgroundColor: COLORS.bgElevated },
  toggleOptionText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
  toggleOptionTextActive: { color: COLORS.textPrimary },
  installNote: { color: COLORS.textMuted, fontSize: 12, marginTop: 8, lineHeight: 16 },
  sectionHeader: {
    paddingVertical: 6, marginBottom: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  sectionHeaderText: {
    color: COLORS.textMuted, fontSize: 11, fontWeight: '700',
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  lineRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: COLORS.border + '80',
  },
  lineLabel: { color: COLORS.textSecondary, fontSize: 13, flex: 1, paddingRight: 8 },
  linePrice: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6,
  },
  totalRowMain: { paddingVertical: 10 },
  totalLabel: { color: COLORS.textSecondary, fontSize: 13 },
  totalLabelMain: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  totalValue: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' },
  totalValueMain: { color: COLORS.gold, fontSize: 20, fontWeight: '800' },
  totalCard: { borderColor: COLORS.borderActive },
  emptyText: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 16 },
  disclaimer: {
    color: COLORS.textMuted, fontSize: 11, lineHeight: 16,
    textAlign: 'center', paddingHorizontal: 8,
  },
  actions: { gap: 10 },
  actionBtn: {
    backgroundColor: COLORS.gold, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
  },
  actionBtnText: { color: '#1a1a2e', fontWeight: '800', fontSize: 15 },
  actionBtnOutline: {
    backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.borderActive,
  },
  actionBtnTextOutline: { color: COLORS.gold, fontWeight: '700', fontSize: 15 },
});
