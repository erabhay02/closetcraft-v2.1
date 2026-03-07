import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, FlatList,
} from 'react-native';
import { COMPONENTS, CATEGORIES, generateId } from '../utils/constants';
import styles from './ComponentPickerScreen.styles';

export default function ComponentPickerScreen({ navigation, route }) {
  const { design } = route.params;

  // Seed quantities from any components already on the design
  const initQty = () => {
    const qty = {};
    COMPONENTS.forEach(c => { qty[c.id] = 0; });
    (design.components || []).forEach(c => {
      if (qty[c.type] !== undefined) qty[c.type] += 1;
    });
    return qty;
  };

  const [quantities, setQuantities] = useState(initQty);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredComponents = activeCategory === 'all'
    ? COMPONENTS
    : COMPONENTS.filter(c => c.category === activeCategory);

  const increment = (id) => setQuantities(q => ({ ...q, [id]: (q[id] || 0) + 1 }));
  const decrement = (id) => setQuantities(q => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }));

  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleDone = () => {
    const newComponents = [];
    COMPONENTS.forEach(compDef => {
      const qty = quantities[compDef.id] || 0;
      for (let i = 0; i < qty; i++) {
        newComponents.push({
          id: generateId(),
          type: compDef.id,
          label: compDef.label,
          x: 0,
          y: 0,
          w: compDef.defaultW,
          h: compDef.h,
        });
      }
    });
    navigation.navigate('Designer', {
      design: { ...design, components: newComponents, updatedAt: new Date().toISOString() },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Components</Text>
        <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
          <Text style={styles.doneBtnText}>
            {totalSelected > 0 ? `Done (${totalSelected})` : 'Done'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
            <Text style={[
              styles.categoryChipText,
              activeCategory === cat.id && styles.categoryChipTextActive,
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Component rows */}
      <FlatList
        data={filteredComponents}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemIcon}>{item.icon}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity style={styles.counterBtn} onPress={() => decrement(item.id)}>
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{quantities[item.id] || 0}</Text>
              <TouchableOpacity style={styles.counterBtn} onPress={() => increment(item.id)}>
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
