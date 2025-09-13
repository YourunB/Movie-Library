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
