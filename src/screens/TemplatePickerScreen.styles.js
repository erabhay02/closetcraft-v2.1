import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

export const SCREEN_W = Dimensions.get('window').width;
export const CARD_W = (SCREEN_W - 48) / 2;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  backBtn: { paddingVertical: 6, width: 60 },
  backBtnText: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  headerTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  searchRow: { paddingHorizontal: 16, paddingBottom: 8 },
  searchInput: {
    backgroundColor: COLORS.bgCard, color: COLORS.textPrimary,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  filterRow: { marginBottom: 12 },
  filterContent: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: COLORS.bgCard, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.goldMuted, borderColor: COLORS.gold },
  chipText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: COLORS.gold },
  grid: { padding: 16, paddingTop: 0 },
  gridRow: { gap: 12, marginBottom: 12 },
  card: {
    width: CARD_W, backgroundColor: COLORS.bgCard,
    borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardDiagram: { marginBottom: 10, borderRadius: 6, overflow: 'hidden' },
  cardName: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700', marginBottom: 4, lineHeight: 16 },
  cardSize: { color: COLORS.textSecondary, fontSize: 11, marginBottom: 2 },
  cardCount: { color: COLORS.textMuted, fontSize: 10 },
  empty: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },
  // Modal
  modal: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  modalClose: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.bgElevated, alignItems: 'center', justifyContent: 'center',
  },
  modalCloseText: { color: COLORS.textSecondary, fontSize: 16 },
  modalTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center', marginHorizontal: 8 },
  modalContent: { padding: 24 },
  modalDiagram: { borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  detailRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  detailCard: {
    flex: 1, backgroundColor: COLORS.bgCard, borderRadius: 12,
    padding: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  detailValue: { color: COLORS.gold, fontSize: 18, fontWeight: '800' },
  detailLabel: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  templateDesc: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 16 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: {
    backgroundColor: COLORS.bgElevated, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  tagText: { color: COLORS.textMuted, fontSize: 11 },
  compListTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 10 },
  compRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  compLabel: { color: COLORS.textSecondary, fontSize: 13 },
  compQty: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
  modalFooter: { padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: COLORS.border },
  useBtn: {
    backgroundColor: COLORS.gold, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  useBtnText: { color: '#1a1a2e', fontSize: 16, fontWeight: '800' },
});
