/**
 * Saved Designs Screen
 * Browse, open, duplicate, and delete saved closet designs
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, CLOSET_TYPES, ROOM_TYPES, MATERIALS, inToDisplay } from '../utils/constants';
import { loadAllDesigns, deleteDesign, duplicateDesign } from '../store/designStore';
import styles from './SavedDesignsScreen.styles';

export default function SavedDesignsScreen({ navigation }) {
  const [designs, setDesigns] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Reload designs when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadDesigns();
    }, [])
  );

  const loadDesigns = async () => {
    const all = await loadAllDesigns();
    setDesigns(all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDesigns();
    setRefreshing(false);
  };

  const handleDelete = (design) => {
    Alert.alert(
      'Delete Design',
      `Are you sure you want to delete "${design.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteDesign(design.id);
            await loadDesigns();
          },
        },
      ]
    );
  };

  const handleDuplicate = async (design) => {
    const copy = await duplicateDesign(design.id);
    await loadDesigns();
    Alert.alert('Duplicated', `"${copy.name}" has been created.`);
  };

  const handleOpen = (design) => {
    navigation.navigate('Designer', { designId: design.id, design });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderDesign = ({ item: design }) => {
    const roomDef = ROOM_TYPES.find(r => r.id === design.roomType);
    const closetDef = CLOSET_TYPES.find(c => c.id === design.closetType);
    const materialDef = MATERIALS.find(m => m.id === design.material);

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleOpen(design)} activeOpacity={0.7}>
        {/* Thumbnail / Color preview */}
        <View style={[styles.thumbnail, { backgroundColor: materialDef?.color || '#444' }]}>
          <Text style={styles.thumbnailIcon}>{roomDef?.icon || '🏠'}</Text>
          <View style={styles.componentCount}>
            <Text style={styles.componentCountText}>{design.components?.length || 0}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>{design.name}</Text>
          <Text style={styles.cardMeta}>
            {closetDef?.label || 'Custom'} • {inToDisplay(design.measurements?.width || 0)} × {inToDisplay(design.measurements?.height || 0)}
          </Text>
          <Text style={styles.cardDate}>{formatDate(design.updatedAt)}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDuplicate(design)}>
            <Text style={styles.actionIcon}>📋</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(design)}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📐</Text>
      <Text style={styles.emptyTitle}>No Saved Designs</Text>
      <Text style={styles.emptyText}>
        Your closet designs will appear here. Start a new design to get going!
      </Text>
      <TouchableOpacity
        style={styles.newDesignBtn}
        onPress={() => navigation.navigate('NewDesign')}
      >
        <Text style={styles.newDesignBtnText}>+ New Design</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Designs</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('NewDesign')}
        >
          <Text style={styles.headerBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={designs}
        keyExtractor={(item) => item.id}
        renderItem={renderDesign}
        contentContainerStyle={designs.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.gold}
          />
        }
      />
    </View>
  );
}
