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
  scroll: { padding: 20, gap: 20, paddingBottom: 48 },
  thumbnail: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 16,
    padding: 16, borderWidth: 1, gap: 14,
  },
  thumbnailSwatch: { width: 48, height: 48, borderRadius: 10 },
  thumbnailInfo: { flex: 1 },
  thumbnailName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  thumbnailMeta: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 2 },
  section: {
    backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, gap: 12,
  },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  linkRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.bgElevated, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  linkText: { flex: 1, color: COLORS.textSecondary, fontSize: 13, fontFamily: 'Courier' },
  copyBtn: {
    backgroundColor: COLORS.bgCard, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: COLORS.borderActive,
  },
  copyBtnDone: { backgroundColor: COLORS.green + '33', borderColor: COLORS.green },
  copyBtnText: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
  linkNote: { color: COLORS.textMuted, fontSize: 12, lineHeight: 16 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  actionIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  actionInfo: { flex: 1 },
  actionLabel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  actionDesc: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  actionArrow: { color: COLORS.textMuted, fontSize: 18 },
  infoBox: {
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, gap: 10,
  },
  infoTitle: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
  infoBody: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 19 },
  signInPrompt: {
    backgroundColor: COLORS.goldMuted, borderRadius: 10, borderWidth: 1,
    borderColor: COLORS.borderActive, paddingVertical: 10, alignItems: 'center', marginTop: 4,
  },
  signInPromptText: { color: COLORS.gold, fontSize: 13, fontWeight: '700' },
});
