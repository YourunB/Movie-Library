import { createAction, props } from '@ngrx/store';

export type Theme = 'light' | 'dark';

export const toggleMenu = createAction('[UI] Toggle Menu');
export const closeMenu = createAction('[UI] Close Menu');
export const toggleTheme = createAction('[UI] Toggle Theme');

export const setTheme = createAction(
  '[UI] Set Theme',
  props<{ theme: Theme }>()
);
