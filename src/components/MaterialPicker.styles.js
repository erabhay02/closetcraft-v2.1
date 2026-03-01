import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },

  // Preview
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewSwatch: {
    width: 120,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  woodGrain: {
    position: 'absolute',
    inset: 0,
  },
  grainLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  wirePattern: {
    position: 'absolute',
    inset: 0,
  },
  wireLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 1,
  },
  previewLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // Categories
  categoriesScroll: {
    maxHeight: 300,
  },
  category: {
    marginBottom: 20,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatchBtn: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 80,
  },
  swatchBtnActive: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldMuted,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginBottom: 4,
  },
  miniWire: {
    position: 'absolute',
    inset: 0,
  },
  miniWireLine: {
    position: 'absolute',
    left: '15%',
    right: '15%',
    height: 1.5,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 1,
  },
  swatchLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  swatchLabelActive: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  checkmark: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.gold,
  },
  applyBtnText: {
    color: COLORS.bg,
    fontSize: 15,
    fontWeight: '700',
  },
});
