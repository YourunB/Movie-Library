import { uiReducer, initialState, UiState } from './ui.reducer';
import { toggleMenu, closeMenu, toggleTheme, setTheme } from './ui.actions';

describe('uiReducer', () => {
  it('should toggle menuOpen with toggleMenu', () => {
    const state = uiReducer(initialState, toggleMenu());
    expect(state.menuOpen).toBeTrue();
    expect(state.history.length).toBe(1);
    expect(state.historyIndex).toBe(0);
  });

  it('should close menu with closeMenu', () => {
    const openState: UiState = { ...initialState, menuOpen: true };
    const state = uiReducer(openState, closeMenu());
    expect(state.menuOpen).toBeFalse();
    expect(state.history.length).toBe(1);
    expect(state.history[0].menuOpen).toBeFalse();
  });

  it('should toggle theme with toggleTheme', () => {
    const state = uiReducer(initialState, toggleTheme());
    expect(state.theme).toBe('light');
    expect(state.history.length).toBe(1);
    expect(state.history[0].theme).toBe('light');
  });

  it('should set theme with setTheme', () => {
    const state = uiReducer(initialState, setTheme({ theme: 'light' }));
    expect(state.theme).toBe('light');
    expect(state.history.length).toBe(1);
    expect(state.history[0].theme).toBe('light');
  });

  it('should limit history to 10 entries', () => {
    let state = initialState;
    for (let i = 0; i < 12; i++) {
      state = uiReducer(state, toggleMenu());
    }
    expect(state.history.length).toBe(10);
    expect(state.historyIndex).toBe(9);
  });
});
