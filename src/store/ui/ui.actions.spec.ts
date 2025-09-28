import {
  toggleMenu,
  closeMenu,
  toggleTheme,
  setTheme,
  Theme
} from './ui.actions';

describe('UI Actions', () => {
  it('should create toggleMenu action', () => {
    const action = toggleMenu();
    expect(action.type).toBe('[UI] Toggle Menu');
  });

  it('should create closeMenu action', () => {
    const action = closeMenu();
    expect(action.type).toBe('[UI] Close Menu');
  });

  it('should create toggleTheme action', () => {
    const action = toggleTheme();
    expect(action.type).toBe('[UI] Toggle Theme');
  });

  it('should create setTheme action with correct payload', () => {
    const theme: Theme = 'dark';
    const action = setTheme({ theme });
    expect(action.type).toBe('[UI] Set Theme');
    expect(action.theme).toBe('dark');
  });
});
