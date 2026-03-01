import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    width: 60,
  },
  backBtnText: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '600',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.bgElevated,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  progressLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  questionText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 8,
  },
  questionHint: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgElevated,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionBtnSelected: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.goldMuted,
  },
  optionIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  optionLabel: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  optionLabelSelected: {
    color: COLORS.textPrimary,
  },
  optionCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCheckText: {
    color: '#1a1a2e',
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
  nextBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
  nextBtnText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
  },
  // Results
  resultsHeader: {
    padding: 20,
    paddingBottom: 12,
  },
  resultsTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  resultsSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  resultsFooter: {
    padding: 20,
    paddingBottom: 40,
  },
  useBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  useBtnDisabled: {
    opacity: 0.4,
  },
  useBtnText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
  },
  resultsDisclaimer: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
