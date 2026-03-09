import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

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
    paddingHorizontal: 16,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBtn: {
    minWidth: 60,
    paddingVertical: 4,
  },
  headerBtnText: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    maxWidth: 160,
  },
  dirtyDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.gold,
  },
  saveBtn: {
    backgroundColor: COLORS.goldMuted,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.borderActive,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Info Bar ─────────────────────────────────────────────────────
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoBarText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },

  // ── Canvas ───────────────────────────────────────────────────────
  canvasScroll: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  canvasScrollHContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasScrollVContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasPadding: {
    padding: 20,
  },
  emptyCanvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyCanvasIcon: {
    fontSize: 28,
    opacity: 0.3,
  },
  emptyCanvasText: {
    color: COLORS.textMuted,
    fontSize: 12,
    opacity: 0.6,
  },

  // ── Draggable Component ──────────────────────────────────────────
  component: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden',
  },
  componentLabelOverlay: {
    position: 'absolute',
    bottom: 2,
    left: 1,
    right: 1,
    alignItems: 'center',
  },
  componentLabel: {
    color: '#ffffff',
    fontSize: 7,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  selectedCorner: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.gold,
  },

  // ── Selected Strip ───────────────────────────────────────────────
  selectedStrip: {
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderActive,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selectedStripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  selectedDims: {
    color: COLORS.gold,
    fontSize: 11,
    marginTop: 1,
  },
  selectedTip: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  deleteBtn: {
    backgroundColor: 'rgba(196,92,92,0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(196,92,92,0.35)',
  },
  deleteBtnText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Toolbar ──────────────────────────────────────────────────────
  toolbar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 30,
    paddingHorizontal: 4,
  },
  toolbarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  toolbarBtnAdd: {
    backgroundColor: COLORS.gold,
    marginHorizontal: 4,
    flex: 1.3,
  },
  toolbarBtnDisabled: {
    opacity: 0.3,
  },
  toolbarIcon: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  toolbarLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
});
