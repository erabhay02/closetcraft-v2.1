/**
 * useHistory — Undo/Redo state management hook
 *
 * Tracks a stack of states and provides undo/redo functionality.
 * Used in the designer to track component placements, moves, deletes, etc.
 *
 * Usage:
 *   const { state, set, undo, redo, canUndo, canRedo, clear } = useHistory(initialState, 50);
 *   set(newComponents);  // Pushes new state
 *   undo();              // Reverts to previous state
 *   redo();              // Re-applies undone state
 */

import { useState, useCallback, useRef } from 'react';

export default function useHistory(initialState, maxHistory = 50) {
  const [index, setIndex] = useState(0);
  const historyRef = useRef([initialState]);

  const state = historyRef.current[index];

  const set = useCallback((newState) => {
    // If we're not at the end, discard future states
    const history = historyRef.current.slice(0, index + 1);

    // Add new state
    history.push(typeof newState === 'function' ? newState(history[history.length - 1]) : newState);

    // Trim to max history
    if (history.length > maxHistory) {
      history.shift();
    } else {
      setIndex(history.length - 1);
    }

    historyRef.current = history;
    setIndex(history.length - 1);
  }, [index, maxHistory]);

  const undo = useCallback(() => {
    setIndex(i => Math.max(0, i - 1));
  }, []);

  const redo = useCallback(() => {
    setIndex(i => Math.min(historyRef.current.length - 1, i + 1));
  }, []);

  const clear = useCallback((newInitialState) => {
    const init = newInitialState !== undefined ? newInitialState : initialState;
    historyRef.current = [init];
    setIndex(0);
  }, [initialState]);

  return {
    state,
    set,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < historyRef.current.length - 1,
    historyLength: historyRef.current.length,
    currentIndex: index,
    clear,
  };
}
