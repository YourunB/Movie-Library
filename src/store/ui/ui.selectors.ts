import { createSelector } from '@ngrx/store';
import { UiState } from './ui.reducer';

export interface RootState {
  ui: UiState;
}

export const selectUi = (state: RootState) => state.ui;

export const selectMenuOpen = createSelector(
  selectUi,
  ui => ui.menuOpen
);

export const selectTheme = createSelector(
  selectUi,
  ui => ui.theme
);

export const selectIsDarkTheme = createSelector(
  selectTheme,
  theme => theme === 'dark'
);

// History selectors
export const selectHistory = createSelector(
  selectUi,
  ui => ui.history
);

export const selectHistoryIndex = createSelector(
  selectUi,
  ui => ui.historyIndex
);

export const selectCanUndo = createSelector(
  selectHistoryIndex,
  index => index > 0
);

export const selectCanRedo = createSelector(
  selectUi,
  ui => ui.historyIndex < ui.history.length - 1
);

export const selectHistoryLength = createSelector(
  selectHistory,
  history => history.length
);
