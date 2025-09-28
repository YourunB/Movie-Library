import { TestBed } from '@angular/core/testing';
import { HistoryService } from './history.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  selectHistory,
  selectHistoryIndex,
  selectCanUndo,
  selectCanRedo,
  selectHistoryLength,
} from '../../../store/ui/ui.selectors';
import { UiState } from '../../../store/ui/ui.reducer';

describe('HistoryService', () => {
  let service: HistoryService;

  const mockHistory: UiState[] = [
    {
      theme: 'light',
      menuOpen: false,
      history: [],
      historyIndex: 0,
    },
    {
      theme: 'dark',
      menuOpen: true,
      history: [],
      historyIndex: 1,
    },
    {
      theme: 'light',
      menuOpen: true,
      history: [],
      historyIndex: 2,
    },
  ];

  const mockIndex = 1;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj<Store>('Store', ['select', 'dispatch']);

    storeSpy.select.and.callFake((selector: unknown) => {
      switch (selector) {
        case selectHistory:
          return of(mockHistory);
        case selectHistoryIndex:
          return of(mockIndex);
        case selectCanUndo:
          return of(mockIndex > 0);
        case selectCanRedo:
          return of(mockIndex < mockHistory.length - 1);
        case selectHistoryLength:
          return of(mockHistory.length);
        default:
          return of(null);
      }
    });

    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: storeSpy }],
    });

    service = TestBed.inject(HistoryService);
  });

  it('should return full history', () => {
    expect(service.getHistory()).toEqual(mockHistory);
  });

  it('should return current index', () => {
    expect(service.getCurrentIndex()).toBe(mockIndex);
  });

  it('should return current state', () => {
    expect(service.getCurrentState()).toEqual(mockHistory[mockIndex]);
  });

  it('should return previous state', () => {
    expect(service.getPreviousState()).toEqual(mockHistory[mockIndex - 1]);
  });

  it('should return next state', () => {
    expect(service.getNextState()).toEqual(mockHistory[mockIndex + 1]);
  });

  it('should report canUndo and canRedo correctly', () => {
    expect(service.canUndo()).toBeTrue();
    expect(service.canRedo()).toBeTrue();
  });

  it('should return correct history info', () => {
    const info = service.getHistoryInfo();
    expect(info.length).toBe(mockHistory.length);
    expect(info.currentIndex).toBe(mockIndex);
    expect(info.canUndo).toBeTrue();
    expect(info.canRedo).toBeTrue();
  });

  it('should format history as string with current marker', () => {
    const result = service.getHistoryAsString();
    expect(result).toContain('← current');
    expect(result).toContain('theme=dark');
    expect(result).toContain('menu=true');
  });
});
