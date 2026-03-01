import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const SCREEN_W = Dimensions.get('window').width;
export const CARD_W = Math.min(SCREEN_W * 0.78, 300);
export const DIAGRAM_W = CARD_W - 32;
export const DIAGRAM_H = 160;

export default StyleSheet.create({
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
  },
  card: {
    width: CARD_W,
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cardSelected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.bgElevated,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  layoutName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  layoutDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  diagramContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  diagram: {
    borderRadius: 8,
  },
  compCount: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 12,
  },
  selectBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.borderActive,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectBtnActive: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },
  selectBtnText: {
    color: COLORS.gold,
    fontWeight: '700',
    fontSize: 14,
  },
  selectBtnTextActive: {
    color: '#1a1a2e',
  },
});
