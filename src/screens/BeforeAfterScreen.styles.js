import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

export const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: COLORS.bg },
  permIcon: { fontSize: 48, marginBottom: 12 },
  permTitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  permText: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  permBtn: {
    backgroundColor: COLORS.gold, borderRadius: 12, paddingVertical: 14,
    paddingHorizontal: 28, marginBottom: 12,
  },
  permBtnText: { color: '#1a1a2e', fontWeight: '800', fontSize: 15 },
  backBtnPlain: { padding: 8 },
  backBtnPlainText: { color: COLORS.textSecondary, fontSize: 14 },
  // Camera
  guideFrame: {
    position: 'absolute',
    top: SCREEN_H * 0.12,
    left: 24,
    right: 24,
    bottom: SCREEN_H * 0.18,
    borderWidth: 1.5,
    borderColor: 'rgba(226,185,127,0.5)',
    borderRadius: 8,
  },
  cameraHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  cameraHeaderBtn: { padding: 6, width: 60 },
  cameraHeaderText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cameraTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  cameraInstructions: {
    position: 'absolute', bottom: 160, left: 0, right: 0, alignItems: 'center',
  },
  instructionText: {
    color: 'rgba(255,255,255,0.8)', fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 8, textAlign: 'center', marginHorizontal: 32,
  },
  cameraFooter: {
    position: 'absolute', bottom: 48, left: 0, right: 0,
    alignItems: 'center',
  },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  captureBtnInner: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff',
  },
  // Preview
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8,
    backgroundColor: COLORS.bg,
  },
  backBtn: { width: 60 },
  backBtnText: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  headerTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' },
  shareBtn: { width: 60, alignItems: 'flex-end' },
  shareBtnText: { color: COLORS.gold, fontSize: 15, fontWeight: '600' },
  photoContainer: {
    flex: 1, backgroundColor: '#111', overflow: 'hidden', margin: 16,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  photo: { width: SCREEN_W - 32, flex: 1 },
  toggleContainer: {
    padding: 16, backgroundColor: COLORS.bg, paddingBottom: 32,
  },
  toggle: {
    flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: 12,
    padding: 4, marginBottom: 12,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 9,
  },
  toggleBtnActive: { backgroundColor: COLORS.bgElevated },
  toggleBtnText: { color: COLORS.textMuted, fontSize: 14, fontWeight: '600' },
  toggleBtnTextActive: { color: COLORS.textPrimary },
  noDesignNote: { color: COLORS.textMuted, fontSize: 12, textAlign: 'center', marginBottom: 12 },
  shareFullBtn: {
    backgroundColor: COLORS.gold, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  shareFullBtnText: { color: '#1a1a2e', fontWeight: '800', fontSize: 15 },
});
