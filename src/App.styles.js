import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f1019',
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
    color: '#f0e6d3',
    marginBottom: 12,
  },
  homeSubtitle: {
    fontSize: 15,
    color: '#8899b0',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: '#556677',
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
    backgroundColor: '#e2b97f',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: 'rgba(226,185,127,0.4)',
  },
  btnTextPrimary: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '700',
  },
  btnTextOutline: {
    color: '#e2b97f',
    fontSize: 16,
    fontWeight: '700',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181825',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
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
    color: '#f0e6d3',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureCardDesc: {
    color: '#8899b0',
    fontSize: 12,
    lineHeight: 17,
  },
  featureCardArrow: {
    color: '#556677',
    fontSize: 22,
  },
  versionBadge: {
    color: '#556677',
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
    color: '#f0e6d3',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  screenDesc: {
    color: '#8899b0',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  featureList: {
    gap: 8,
    marginBottom: 24,
  },
  featureItem: {
    color: '#7b9e6b',
    fontSize: 13,
  },
  designSummary: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  designSummaryTitle: {
    color: '#e2b97f',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  designSummaryRow: {
    color: '#8899b0',
    fontSize: 13,
    marginBottom: 2,
  },
  settingsScreen: {
    flex: 1,
    backgroundColor: '#0f1019',
    padding: 24,
    paddingTop: 60,
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f0e6d3',
    marginBottom: 24,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  settingsRowTappable: {
    marginTop: 8,
  },
  settingsLabel: {
    color: '#f0e6d3',
    fontSize: 15,
  },
  settingsValue: {
    color: '#8899b0',
    fontSize: 14,
  },
  settingsArrow: {
    color: '#e2b97f',
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
    color: '#e2b97f',
    fontSize: 15,
    fontWeight: '600',
  },
  designerHeaderTitle: {
    color: '#f0e6d3',
    fontSize: 17,
    fontWeight: '700',
  },
});
