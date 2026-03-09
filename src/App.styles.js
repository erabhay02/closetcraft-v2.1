import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07111f',
  },
  homeContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  homeHero: {
    alignItems: 'center',
    marginBottom: 36,
  },
  homeEmoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  homeTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#e8f4ff',
    marginBottom: 12,
  },
  homeSubtitle: {
    fontSize: 15,
    color: '#7baac8',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: '#405570',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#00d4f5',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(0,212,245,0.35)',
  },
  btnTextPrimary: {
    color: '#07111f',
    fontSize: 16,
    fontWeight: '700',
  },
  btnTextOutline: {
    color: '#00d4f5',
    fontSize: 16,
    fontWeight: '700',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1f38',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 14,
  },
  featureCardIcon: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  featureCardText: {
    flex: 1,
  },
  featureCardTitle: {
    color: '#e8f4ff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureCardDesc: {
    color: '#7baac8',
    fontSize: 12,
    lineHeight: 17,
  },
  featureCardArrow: {
    color: '#405570',
    fontSize: 22,
  },
  versionBadge: {
    color: '#405570',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  centeredContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  screenTitle: {
    color: '#e8f4ff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  screenDesc: {
    color: '#7baac8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  featureList: {
    gap: 8,
    marginBottom: 24,
  },
  featureItem: {
    color: '#4caf50',
    fontSize: 13,
  },
  designSummary: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  designSummaryTitle: {
    color: '#00d4f5',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  designSummaryRow: {
    color: '#7baac8',
    fontSize: 13,
    marginBottom: 2,
  },
  settingsScreen: {
    flex: 1,
    backgroundColor: '#07111f',
    padding: 24,
    paddingTop: 60,
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e8f4ff',
    marginBottom: 24,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingsRowTappable: {
    marginTop: 8,
  },
  settingsLabel: {
    color: '#e8f4ff',
    fontSize: 15,
  },
  settingsValue: {
    color: '#7baac8',
    fontSize: 14,
  },
  settingsArrow: {
    color: '#00d4f5',
    fontSize: 14,
    fontWeight: '600',
  },
  designerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
  },
  designerBackBtn: {
    width: 60,
  },
  designerBackText: {
    color: '#00d4f5',
    fontSize: 15,
    fontWeight: '600',
  },
  designerHeaderTitle: {
    color: '#e8f4ff',
    fontSize: 17,
    fontWeight: '700',
  },
});
