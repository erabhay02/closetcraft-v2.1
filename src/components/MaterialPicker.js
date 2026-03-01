/**
 * Material Picker Component
 * Allows users to select closet material/finish with visual previews
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { COLORS, MATERIALS } from '../utils/constants';
import styles from './MaterialPicker.styles';

export default function MaterialPicker({ selectedMaterial, onSelect, visible, onClose }) {
  const [previewMaterial, setPreviewMaterial] = useState(selectedMaterial);
  
  const categories = [
    { id: 'melamine', label: 'Melamine', materials: MATERIALS.filter(m => m.id.startsWith('melamine')) },
    { id: 'wood', label: 'Real Wood', materials: MATERIALS.filter(m => m.id.startsWith('wood')) },
    { id: 'laminate', label: 'Laminate', materials: MATERIALS.filter(m => m.id.startsWith('lam')) },
    { id: 'wire', label: 'Wire Systems', materials: MATERIALS.filter(m => m.id.startsWith('wire')) },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Choose Material</Text>
          <Text style={styles.subtitle}>
            Select a finish for your closet components
          </Text>

          {/* Preview swatch */}
          <View style={styles.previewContainer}>
            <View style={[styles.previewSwatch, { backgroundColor: MATERIALS.find(m => m.id === previewMaterial)?.color || '#ccc' }]}>
              {MATERIALS.find(m => m.id === previewMaterial)?.pattern === 'wood' && (
                <View style={styles.woodGrain}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <View key={i} style={[styles.grainLine, { top: `${10 + i * 12}%`, opacity: 0.15 + Math.random() * 0.1 }]} />
                  ))}
                </View>
              )}
              {MATERIALS.find(m => m.id === previewMaterial)?.pattern === 'wire' && (
                <View style={styles.wirePattern}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <View key={i} style={[styles.wireLine, { top: `${15 + i * 18}%` }]} />
                  ))}
                </View>
              )}
            </View>
            <Text style={styles.previewLabel}>
              {MATERIALS.find(m => m.id === previewMaterial)?.label || 'Select a material'}
            </Text>
          </View>

          <ScrollView style={styles.categoriesScroll} showsVerticalScrollIndicator={false}>
            {categories.map(cat => (
              <View key={cat.id} style={styles.category}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <View style={styles.swatchRow}>
                  {cat.materials.map(mat => (
                    <TouchableOpacity
                      key={mat.id}
                      onPress={() => setPreviewMaterial(mat.id)}
                      style={[
                        styles.swatchBtn,
                        previewMaterial === mat.id && styles.swatchBtnActive,
                      ]}
                    >
                      <View style={[styles.swatch, { backgroundColor: mat.color }]}>
                        {mat.pattern === 'wire' && (
                          <View style={styles.miniWire}>
                            {Array.from({ length: 3 }).map((_, i) => (
                              <View key={i} style={[styles.miniWireLine, { top: `${25 + i * 25}%` }]} />
                            ))}
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.swatchLabel,
                        previewMaterial === mat.id && styles.swatchLabelActive,
                      ]}>{mat.label}</Text>
                      {previewMaterial === mat.id && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                onSelect(previewMaterial);
                onClose();
              }}
            >
              <Text style={styles.applyBtnText}>Apply Material</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
