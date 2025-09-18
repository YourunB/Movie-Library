// src/store/ui.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { toggleMenu, closeMenu, toggleTheme, setTheme, Theme } from './ui.actions';

export interface UiState {
  menuOpen: boolean;
  theme: Theme;
  history: UiState[];
  historyIndex: number;
}

export const initialState: UiState = {
  menuOpen: false,
  theme: 'dark',
  history: [],
  historyIndex: -1,
};

// Helper function to add state to history
const addToHistory = (state: UiState, newState: Partial<UiState>): UiState => {
  const updatedState = { ...state, ...newState };
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(updatedState);

  // Limit history to last 10 entries
  const limitedHistory = newHistory.slice(-10);

  return {
    ...updatedState,
    history: limitedHistory,
    historyIndex: limitedHistory.length - 1,
  };
};

// Helper function to get previous state from history
const getPreviousState = (state: UiState): UiState | null => {
  if (state.historyIndex > 0) {
    return state.history[state.historyIndex - 1];
  }
  return null;
};

// Helper function to get next state from history
const getNextState = (state: UiState): UiState | null => {
  if (state.historyIndex < state.history.length - 1) {
    return state.history[state.historyIndex + 1];
  }
  return null;
};

export const uiReducer = createReducer(
  initialState,
  on(toggleMenu, (state): UiState => {
    const newState = { ...state, menuOpen: !state.menuOpen };
    return addToHistory(state, newState);
  }),
  on(closeMenu, (state): UiState => {
    const newState = { ...state, menuOpen: false };
    return addToHistory(state, newState);
  }),
  on(toggleTheme, (state): UiState => {
    const newState = {
      ...state,
      theme: state.theme === 'light' ? 'dark' : 'light',
    };
    return addToHistory(state, newState);
  }),
  on(setTheme, (state, { theme }): UiState => {
    const newState = { ...state, theme };
    return addToHistory(state, newState);
  })
);

// Export helper functions for use in components
export { addToHistory, getPreviousState, getNextState };
