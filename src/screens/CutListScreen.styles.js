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
  printBtn: { width: 60, alignItems: 'flex-end' },
  printBtnText: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  scroll: { padding: 16, gap: 16, paddingBottom: 48 },
  summaryCard: {
    flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: COLORS.border,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { color: COLORS.gold, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 11 },
  summaryDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 8 },
  sheetDiagram: {
    backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
  },
  sheetLabel: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 12, alignSelf: 'flex-start' },
  svg: { borderRadius: 6 },
  panelSection: {
    backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  panelSectionTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 12 },
  panelRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: COLORS.border + '60', gap: 10,
  },
  panelColorDot: { width: 10, height: 10, borderRadius: 5 },
  panelLabel: { flex: 1, color: COLORS.textSecondary, fontSize: 12 },
  panelDims: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '600', width: 70, textAlign: 'right' },
  panelQty: { color: COLORS.gold, fontSize: 12, fontWeight: '700', width: 30, textAlign: 'right' },
  tipBox: {
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, gap: 8,
  },
  tipTitle: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
  tipText: { color: COLORS.textSecondary, fontSize: 12, lineHeight: 17 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  notApplicableIcon: { fontSize: 48, marginBottom: 12 },
  notApplicableTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  notApplicableText: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
