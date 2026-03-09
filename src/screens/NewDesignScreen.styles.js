import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const SCREEN_W = Dimensions.get('window').width;
const CARD_W = (SCREEN_W - 48 - 12) / 2; // 2-col grid with 24px padding + 12px gap

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ── Header ──────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBtn: {
    minWidth: 48,
  },
  headerBtnText: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  stepCounter: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    minWidth: 48,
    textAlign: 'right',
  },

  // ── Content ──────────────────────────────────────────────────────
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 8,
  },

  // ── Step Indicator ───────────────────────────────────────────────
  stepRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 28,
    alignItems: 'center',
  },
  stepDot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.bgElevated,
  },
  stepDotActive: {
    backgroundColor: COLORS.gold,
  },
  stepDotDone: {
    backgroundColor: COLORS.goldDark,
  },

  // ── Step titles ──────────────────────────────────────────────────
  stepTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 24,
  },

  // ── Room Type Grid ───────────────────────────────────────────────
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: CARD_W,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  typeCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldMuted,
  },
  typeCardIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  typeCardLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  typeCardDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },

  // ── Closet Type Cards ────────────────────────────────────────────
  closetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 10,
    gap: 12,
  },
  closetCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldMuted,
  },
  closetCardIcon: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  closetCardText: {
    flex: 1,
  },
  closetCardLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  closetCardLabelActive: {
    color: COLORS.gold,
  },
  closetCardHint: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  closetCardRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closetCardRadioActive: {
    borderColor: COLORS.gold,
  },
  closetCardRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
  },

  // ── Measurement Inputs ───────────────────────────────────────────
  inputRow: {
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  inputHint: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    padding: 14,
    fontWeight: '600',
  },
  inputUnit: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  measureTip: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  measureTipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },

  // ── Materials ─────────────────────────────────────────────────────
  materialList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  materialItem: {
    alignItems: 'center',
    width: 68,
    padding: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  materialItemActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldMuted,
  },
  materialSwatch: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginBottom: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  wireLineH: {
    position: 'absolute',
    left: 0, right: 0,
    top: '20%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  materialLabel: {
    color: COLORS.textSecondary,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
  },
  materialLabelActive: {
    color: COLORS.gold,
  },
  materialCheck: {
    position: 'absolute',
    top: 2,
    right: 4,
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
  },

  // ── Navigation ────────────────────────────────────────────────────
  navRow: {
    marginTop: 32,
  },
  nextBtn: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderActive,
  },
  nextBtnText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
  },
  startBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startBtnText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '800',
  },
});
