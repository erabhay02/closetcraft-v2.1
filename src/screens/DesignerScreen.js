/**
 * DesignerScreen — Full 2D canvas designer
 * Drag-and-drop components, snap-to-grid, undo/redo, save, material picker
 */
import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Animated,
  PanResponder, Alert, StyleSheet,
} from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import {
  COLORS, COMPONENTS, GRID, generateId, snapToGrid, inToDisplay,
} from '../utils/constants';
import { saveDesign } from '../store/designStore';
import MaterialPicker from '../components/MaterialPicker';
import ComponentShape from '../components/ComponentShape';
import styles from './DesignerScreen.styles';

// ─── State Reducer ────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case 'SET_COMPONENTS': {
      const newHistory = [...state.history.slice(0, state.histIdx + 1), action.components];
      return {
        ...state,
        components: action.components,
        history: newHistory,
        histIdx: newHistory.length - 1,
        isDirty: action.isDirty !== false,
      };
    }
    case 'MOVE_COMPONENT': {
      const newComps = state.components.map(c =>
        c.id === action.id ? { ...c, x: action.x, y: action.y } : c
      );
      const newHistory = [...state.history.slice(0, state.histIdx + 1), newComps];
      return { ...state, components: newComps, history: newHistory, histIdx: newHistory.length - 1, isDirty: true };
    }
    case 'DELETE_COMPONENT': {
      const newComps = state.components.filter(c => c.id !== action.id);
      const newHistory = [...state.history.slice(0, state.histIdx + 1), newComps];
      return { ...state, components: newComps, history: newHistory, histIdx: newHistory.length - 1, selectedId: null, isDirty: true };
    }
    case 'UNDO': {
      if (state.histIdx <= 0) return state;
      const newIdx = state.histIdx - 1;
      return { ...state, components: state.history[newIdx], histIdx: newIdx, selectedId: null };
    }
    case 'REDO': {
      if (state.histIdx >= state.history.length - 1) return state;
      const newIdx = state.histIdx + 1;
      return { ...state, components: state.history[newIdx], histIdx: newIdx };
    }
    case 'SELECT': return { ...state, selectedId: action.id };
    case 'DESELECT': return { ...state, selectedId: null };
    case 'SET_MATERIAL': return { ...state, material: action.material, isDirty: true };
    case 'MARK_SAVED': return { ...state, isDirty: false };
    default: return state;
  }
}

// ─── Draggable Component ──────────────────────────────────────────

function DraggableComponent({ comp, selected, canvasW, canvasH, hScrollRef, vScrollRef, onSelect, onMove }) {
  const pan = useRef(new Animated.ValueXY({ x: comp.x, y: comp.y })).current;
  const isDraggingRef = useRef(false);
  const movedRef = useRef(false);

  const compDef = COMPONENTS.find(c => c.id === comp.type);
  const pixelW = comp.w * GRID.scale;
  const pixelH = comp.h * GRID.scale;

  // Sync position from parent (undo/redo)
  useEffect(() => {
    if (!isDraggingRef.current) {
      pan.x.setValue(comp.x);
      pan.y.setValue(comp.y);
    }
  }, [comp.x, comp.y, pan.x, pan.y]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      isDraggingRef.current = true;
      movedRef.current = false;
      pan.setOffset({ x: pan.x._value, y: pan.y._value });
      pan.setValue({ x: 0, y: 0 });
      hScrollRef.current?.setNativeProps({ scrollEnabled: false });
      vScrollRef.current?.setNativeProps({ scrollEnabled: false });
      Haptics.selectionAsync().catch(() => {});
    },
    onPanResponderMove: (_, g) => {
      if (Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3) movedRef.current = true;
      Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(_, g);
    },
    onPanResponderRelease: () => {
      isDraggingRef.current = false;
      pan.flattenOffset();
      hScrollRef.current?.setNativeProps({ scrollEnabled: true });
      vScrollRef.current?.setNativeProps({ scrollEnabled: true });

      if (movedRef.current) {
        const snappedX = Math.max(0, Math.min(snapToGrid(pan.x._value), canvasW - pixelW));
        const snappedY = Math.max(0, Math.min(snapToGrid(pan.y._value), canvasH - pixelH));
        pan.x.setValue(snappedX);
        pan.y.setValue(snappedY);
        onMove(snappedX, snappedY);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      } else {
        onSelect();
      }
    },
    onPanResponderTerminate: () => {
      isDraggingRef.current = false;
      pan.flattenOffset();
      hScrollRef.current?.setNativeProps({ scrollEnabled: true });
      vScrollRef.current?.setNativeProps({ scrollEnabled: true });
    },
  });

  const baseColor = compDef?.color || '#888888';

  return (
    <Animated.View
      style={[
        styles.component,
        {
          left: pan.x,
          top: pan.y,
          width: pixelW,
          height: Math.max(pixelH, 20),
          borderColor: selected ? COLORS.gold : 'transparent',
          borderWidth: selected ? 2 : 0,
          zIndex: selected ? 100 : 1,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <ComponentShape type={comp.type} w={pixelW} h={Math.max(pixelH, 20)} color={baseColor} />
      {pixelH > 28 && (
        <View style={styles.componentLabelOverlay} pointerEvents="none">
          <Text style={styles.componentLabel} numberOfLines={1}>{comp.label}</Text>
        </View>
      )}
      {selected && <View style={styles.selectedCorner} />}
    </Animated.View>
  );
}

// ─── Canvas Grid (SVG background) ────────────────────────────────

function CanvasGrid({ canvasW, canvasH, measurements }) {
  const majorStep = GRID.majorGridEvery * GRID.scale; // 48px per foot
  const lines = [];

  for (let x = majorStep; x < canvasW; x += majorStep) {
    lines.push(<Line key={`v${x}`} x1={x} y1={0} x2={x} y2={canvasH} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />);
  }
  for (let y = majorStep; y < canvasH; y += majorStep) {
    lines.push(<Line key={`h${y}`} x1={0} y1={y} x2={canvasW} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />);
  }

  return (
    <Svg style={StyleSheet.absoluteFill} width={canvasW} height={canvasH}>
      <Rect x={0} y={0} width={canvasW} height={canvasH} fill="#1a1a2e" stroke={COLORS.gold} strokeWidth={2} rx={2} />
      {lines}
      {/* Floor line */}
      <Line x1={0} y1={canvasH - 2} x2={canvasW} y2={canvasH - 2} stroke={COLORS.goldDark} strokeWidth={3} />
      {/* Width label */}
      <SvgText x={canvasW / 2} y={canvasH - 6} textAnchor="middle" fill={COLORS.textMuted} fontSize={9}>
        {inToDisplay(measurements.width)} wide
      </SvgText>
      {/* Height label (rotated) */}
      <SvgText
        x={10} y={canvasH / 2}
        rotation="-90" originX={10} originY={canvasH / 2}
        textAnchor="middle" fill={COLORS.textMuted} fontSize={9}
      >
        {inToDisplay(measurements.height)} tall
      </SvgText>
    </Svg>
  );
}

// ─── Designer Screen ──────────────────────────────────────────────

export default function DesignerScreen({ navigation, route }) {
  const initialDesign = route.params?.design ?? {
    name: 'My Closet',
    roomType: 'primary',
    closetType: 'walkin',
    measurements: { width: 96, height: 96, depth: 72 },
    material: 'melamine-white',
    components: [],
  };

  const initComponents = initialDesign.components || [];

  const [state, dispatch] = useReducer(reducer, {
    components: initComponents,
    history: [initComponents],
    histIdx: 0,
    selectedId: null,
    isDirty: false,
    material: initialDesign.material || 'melamine-white',
    showMaterialPicker: false,
    isSaving: false,
  });

  // Extend state with showMaterialPicker and isSaving via separate state
  const [showMaterialPicker, setShowMaterialPicker] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const hScrollRef = useRef(null);
  const vScrollRef = useRef(null);
  const routeParamsRef = useRef(route.params);
  const lastProcessedDesignRef = useRef(route.params?.design);

  useEffect(() => { routeParamsRef.current = route.params; }, [route.params]);

  const { components, selectedId, isDirty, material } = state;
  const canvasW = initialDesign.measurements.width * GRID.scale;
  const canvasH = initialDesign.measurements.height * GRID.scale;
  const selectedComp = components.find(c => c.id === selectedId) || null;
  const selectedCompDef = selectedComp ? COMPONENTS.find(c => c.id === selectedComp.type) : null;
  const canUndo = state.histIdx > 0;
  const canRedo = state.histIdx < state.history.length - 1;

  // Detect when ComponentPicker navigates back with new components
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const newDesign = routeParamsRef.current?.design;
      if (newDesign && newDesign !== lastProcessedDesignRef.current) {
        lastProcessedDesignRef.current = newDesign;
        if (newDesign.components !== undefined) {
          dispatch({ type: 'SET_COMPONENTS', components: newDesign.components });
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleMove = useCallback((id, x, y) => {
    dispatch({ type: 'MOVE_COMPONENT', id, x, y });
  }, []);

  const handleSelect = useCallback((id) => {
    dispatch({ type: 'SELECT', id });
    Haptics.selectionAsync().catch(() => {});
  }, []);

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    Alert.alert(
      'Remove Component',
      `Remove "${selectedComp?.label}" from the design?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: () => {
            dispatch({ type: 'DELETE_COMPONENT', id: selectedId });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
          },
        },
      ]
    );
  }, [selectedId, selectedComp]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await saveDesign({
        ...initialDesign,
        components,
        material,
        updatedAt: new Date().toISOString(),
      });
      dispatch({ type: 'MARK_SAVED' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e) {
      Alert.alert('Save Failed', e.message);
    } finally {
      setIsSaving(false);
    }
  }, [initialDesign, components, material]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. What would you like to do?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Save & Exit', onPress: async () => { await handleSave(); navigation.goBack(); } },
          { text: 'Stay', style: 'cancel' },
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [isDirty, handleSave, navigation]);

  const navigateToComponentPicker = useCallback(() => {
    navigation.navigate('ComponentPicker', {
      design: { ...initialDesign, components, material },
    });
  }, [navigation, initialDesign, components, material]);

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.headerBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{initialDesign.name}</Text>
          {isDirty && <View style={styles.dirtyDot} />}
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.7}
        >
          <Text style={styles.saveBtnText}>{isSaving ? 'Saving…' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      {/* Dimension info bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoBarText}>
          {inToDisplay(initialDesign.measurements.width)}W ×{' '}
          {inToDisplay(initialDesign.measurements.height)}H ×{' '}
          {inToDisplay(initialDesign.measurements.depth)}D
        </Text>
        <Text style={styles.infoBarText}>
          {components.length} component{components.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Canvas */}
      <ScrollView
        ref={hScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.canvasScrollHContent}
        style={styles.canvasScroll}
      >
        <ScrollView
          ref={vScrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.canvasScrollVContent}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => dispatch({ type: 'DESELECT' })}
            style={styles.canvasPadding}
          >
            <View style={{ width: canvasW, height: canvasH, position: 'relative' }}>
              <CanvasGrid canvasW={canvasW} canvasH={canvasH} measurements={initialDesign.measurements} />
              {components.length === 0 && (
                <View style={styles.emptyCanvas}>
                  <Text style={styles.emptyCanvasIcon}>🧩</Text>
                  <Text style={styles.emptyCanvasText}>Tap Add to place components</Text>
                </View>
              )}
              {components.map(comp => (
                <DraggableComponent
                  key={comp.id}
                  comp={comp}
                  selected={selectedId === comp.id}
                  canvasW={canvasW}
                  canvasH={canvasH}
                  hScrollRef={hScrollRef}
                  vScrollRef={vScrollRef}
                  onSelect={() => handleSelect(comp.id)}
                  onMove={(x, y) => handleMove(comp.id, x, y)}
                />
              ))}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>

      {/* Selected component strip */}
      {selectedComp && (
        <View style={styles.selectedStrip}>
          <View style={styles.selectedStripRow}>
            <View>
              <Text style={styles.selectedName}>{selectedComp.label}</Text>
              <Text style={styles.selectedDims}>
                {selectedComp.w}"W × {selectedComp.h}"H
              </Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
              <Text style={styles.deleteBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
          {selectedCompDef?.tips && (
            <Text style={styles.selectedTip} numberOfLines={2}>
              💡 {selectedCompDef.tips}
            </Text>
          )}
        </View>
      )}

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolbarBtn, !canUndo && styles.toolbarBtnDisabled]}
          onPress={() => { dispatch({ type: 'UNDO' }); Haptics.selectionAsync().catch(() => {}); }}
          disabled={!canUndo}
        >
          <Text style={styles.toolbarIcon}>↩</Text>
          <Text style={styles.toolbarLabel}>Undo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolbarBtn, !canRedo && styles.toolbarBtnDisabled]}
          onPress={() => { dispatch({ type: 'REDO' }); Haptics.selectionAsync().catch(() => {}); }}
          disabled={!canRedo}
        >
          <Text style={styles.toolbarIcon}>↪</Text>
          <Text style={styles.toolbarLabel}>Redo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.toolbarBtn, styles.toolbarBtnAdd]} onPress={navigateToComponentPicker}>
          <Text style={[styles.toolbarIcon, { color: COLORS.bg }]}>＋</Text>
          <Text style={[styles.toolbarLabel, { color: COLORS.bg, fontWeight: '700' }]}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarBtn} onPress={() => setShowMaterialPicker(true)}>
          <Text style={styles.toolbarIcon}>🎨</Text>
          <Text style={styles.toolbarLabel}>Material</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolbarBtn, components.length === 0 && styles.toolbarBtnDisabled]}
          onPress={() => navigation.navigate('CostEstimate', { design: { ...initialDesign, components, material } })}
          disabled={components.length === 0}
        >
          <Text style={styles.toolbarIcon}>💰</Text>
          <Text style={styles.toolbarLabel}>Cost</Text>
        </TouchableOpacity>
      </View>

      <MaterialPicker
        visible={showMaterialPicker}
        currentMaterial={material}
        onSelect={(m) => dispatch({ type: 'SET_MATERIAL', material: m })}
        onClose={() => setShowMaterialPicker(false)}
      />
    </View>
  );
}
