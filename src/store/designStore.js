/**
 * ClosetCraft Design Store
 * Handles saving, loading, and managing closet designs using AsyncStorage
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, generateId } from '../utils/constants';

// ─── Design Schema ────────────────────────────────────────────────
/**
 * @typedef {Object} ClosetDesign
 * @property {string} id - Unique design ID
 * @property {string} name - User-given name
 * @property {string} roomType - Room type ID
 * @property {string} closetType - Closet type ID
 * @property {Object} measurements - { width, height, depth } in inches
 * @property {string} material - Material ID
 * @property {Array} components - Placed components with positions
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {string|null} thumbnail - Base64 thumbnail image
 */

// ─── Save a Design ────────────────────────────────────────────────
export async function saveDesign(design) {
  try {
    const designs = await loadAllDesigns();
    const now = new Date().toISOString();
    
    const existing = designs.findIndex(d => d.id === design.id);
    
    if (existing >= 0) {
      // Update existing
      designs[existing] = {
        ...designs[existing],
        ...design,
        updatedAt: now,
      };
    } else {
      // New design
      designs.push({
        id: generateId(),
        name: design.name || `Design ${designs.length + 1}`,
        roomType: design.roomType || 'custom',
        closetType: design.closetType || 'reachin',
        measurements: design.measurements || { width: 72, height: 96, depth: 24 },
        material: design.material || 'melamine-white',
        components: design.components || [],
        createdAt: now,
        updatedAt: now,
        thumbnail: design.thumbnail || null,
        ...design,
      });
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.designs, JSON.stringify(designs));
    return designs;
  } catch (error) {
    console.error('Error saving design:', error);
    throw error;
  }
}

// ─── Load All Designs ─────────────────────────────────────────────
export async function loadAllDesigns() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.designs);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading designs:', error);
    return [];
  }
}

// ─── Load Single Design ──────────────────────────────────────────
export async function loadDesign(id) {
  try {
    const designs = await loadAllDesigns();
    return designs.find(d => d.id === id) || null;
  } catch (error) {
    console.error('Error loading design:', error);
    return null;
  }
}

// ─── Delete a Design ──────────────────────────────────────────────
export async function deleteDesign(id) {
  try {
    const designs = await loadAllDesigns();
    const filtered = designs.filter(d => d.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.designs, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting design:', error);
    throw error;
  }
}

// ─── Duplicate a Design ──────────────────────────────────────────
export async function duplicateDesign(id) {
  try {
    const designs = await loadAllDesigns();
    const source = designs.find(d => d.id === id);
    if (!source) throw new Error('Design not found');
    
    const now = new Date().toISOString();
    const copy = {
      ...source,
      id: generateId(),
      name: `${source.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    
    designs.push(copy);
    await AsyncStorage.setItem(STORAGE_KEYS.designs, JSON.stringify(designs));
    return copy;
  } catch (error) {
    console.error('Error duplicating design:', error);
    throw error;
  }
}

// ─── Save Last Active Design ID ──────────────────────────────────
export async function setLastDesignId(id) {
  await AsyncStorage.setItem(STORAGE_KEYS.lastDesign, id);
}

export async function getLastDesignId() {
  return await AsyncStorage.getItem(STORAGE_KEYS.lastDesign);
}

// ─── Settings ─────────────────────────────────────────────────────
export async function saveSettings(settings) {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export async function loadSettings() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.settings);
    return json ? JSON.parse(json) : {
      unit: 'inches',
      haptics: true,
      showTips: true,
      defaultMaterial: 'melamine-white',
      gridSnap: true,
    };
  } catch {
    return { unit: 'inches', haptics: true, showTips: true, defaultMaterial: 'melamine-white', gridSnap: true };
  }
}

// ─── Export Design Data ───────────────────────────────────────────
export function designToExportData(design) {
  return {
    appVersion: '2.0.0',
    exportedAt: new Date().toISOString(),
    design: {
      name: design.name,
      roomType: design.roomType,
      closetType: design.closetType,
      measurements: design.measurements,
      material: design.material,
      components: design.components.map(c => ({
        type: c.type,
        label: c.label,
        x: c.x,
        y: c.y,
        w: c.w,
        h: c.h,
      })),
    },
  };
}
