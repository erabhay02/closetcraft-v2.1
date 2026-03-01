import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.bgCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  closeBtnText: { color: COLORS.textSecondary, fontSize: 16 },
  titleSection: { marginBottom: 24 },
  title: { color: COLORS.textPrimary, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20 },
  errorBox: {
    backgroundColor: 'rgba(196,92,92,0.15)', borderRadius: 10,
    padding: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.red,
  },
  errorText: { color: COLORS.red, fontSize: 13, lineHeight: 18 },
  form: { gap: 16, marginBottom: 20 },
  fieldGroup: { gap: 6 },
  fieldLabel: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: COLORS.bgCard, color: COLORS.textPrimary,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.gold, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  btnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#1a1a2e', fontWeight: '800', fontSize: 16 },
  toggleBtn: { alignItems: 'center', paddingVertical: 10, marginBottom: 20 },
  toggleText: { color: COLORS.textSecondary, fontSize: 14 },
  toggleLink: { color: COLORS.gold, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  socialBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: 12, paddingVertical: 13,
    borderWidth: 1, borderColor: COLORS.border, gap: 8,
  },
  socialIcon: { fontSize: 18 },
  socialLabel: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 14 },
  skipBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 24 },
  skipText: { color: COLORS.textMuted, fontSize: 13, textDecorationLine: 'underline' },
  infoBox: {
    backgroundColor: COLORS.bgCard, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  infoTitle: { color: COLORS.gold, fontSize: 13, fontWeight: '700', marginBottom: 10 },
  infoItem: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 6, lineHeight: 18 },
});
