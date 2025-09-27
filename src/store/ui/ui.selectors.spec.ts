import {
  selectMenuOpen,
  selectTheme,
  selectIsDarkTheme,
  selectHistory,
  selectHistoryIndex,
  selectCanUndo,
  selectCanRedo,
  selectHistoryLength
} from './ui.selectors';
import { RootState } from './ui.selectors';

describe('UI Selectors', () => {
  const mockState: RootState = {
    ui: {
      menuOpen: true,
      theme: 'dark',
      history: [
        { menuOpen: false, theme: 'light', history: [], historyIndex: -1 },
        { menuOpen: true, theme: 'dark', history: [], historyIndex: -1 }
      ],
      historyIndex: 1
    }
  };

  it('should select menuOpen', () => {
    expect(selectMenuOpen(mockState)).toBeTrue();
  });

  it('should select theme', () => {
    expect(selectTheme(mockState)).toBe('dark');
  });

  it('should select isDarkTheme', () => {
    expect(selectIsDarkTheme(mockState)).toBeTrue();
  });

  it('should select history', () => {
    expect(selectHistory(mockState).length).toBe(2);
  });

  it('should select historyIndex', () => {
    expect(selectHistoryIndex(mockState)).toBe(1);
  });

  it('should return true for canUndo when index > 0', () => {
    expect(selectCanUndo(mockState)).toBeTrue();
  });

  it('should return false for canRedo when index is at end', () => {
    expect(selectCanRedo(mockState)).toBeFalse();
  });

  it('should return correct history length', () => {
    expect(selectHistoryLength(mockState)).toBe(2);
  });
});
