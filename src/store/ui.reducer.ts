import { createReducer, on } from '@ngrx/store';
import { toggleMenu, closeMenu } from './ui.actions';

export interface UiState {
  menuOpen: boolean;
}

export const initialState: UiState = {
  menuOpen: false
};

export const uiReducer = createReducer(
  initialState,
  on(toggleMenu, state => ({ ...state, menuOpen: !state.menuOpen })),
  on(closeMenu, state => ({ ...state, menuOpen: false }))
);
