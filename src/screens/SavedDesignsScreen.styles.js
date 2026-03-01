import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  headerBtnText: {
    color: COLORS.bg,
    fontWeight: '700',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },

  // Card
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnail: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  thumbnailIcon: {
    fontSize: 28,
  },
  componentCount: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  componentCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  cardActions: {
    justifyContent: 'center',
    paddingRight: 12,
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
  actionIcon: {
    fontSize: 16,
  },

  // Empty
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 280,
  },
  newDesignBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  newDesignBtnText: {
    color: COLORS.bg,
    fontWeight: '700',
    fontSize: 15,
  },
});
