import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { setTheme, toggleTheme } from '../../../store/ui/ui.actions';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockStore: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        provideMockStore({
          initialState: {
            ui: {
              menuOpen: false,
              theme: 'dark',
            },
          },
        }),
      ],
    });

    mockStore = TestBed.inject(MockStore);
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with dark theme by default', () => {
    expect(service.currentTheme).toBe('dark');
  });

  it('should expose theme$ as observable', (done) => {
    service.theme$.subscribe((theme) => {
      expect(theme).toBe('dark');
      done();
    });
  });

  it('should toggle theme correctly', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    service.toggleTheme();
    expect(dispatchSpy).toHaveBeenCalledWith(toggleTheme());
  });

  it('should set theme correctly', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    service.setTheme('light');
    expect(dispatchSpy).toHaveBeenCalledWith(setTheme({ theme: 'light' }));
  });
});

describe('ThemeService advanced behavior', () => {
  let service: ThemeService;
  let mockStore: MockStore;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    spyOn(window, 'matchMedia').and.callFake((query: string): MediaQueryList => {
      return {
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {
          /* noop */
        },
        removeEventListener: () => {
          /* noop */
        },
        dispatchEvent: () => false,
        addListener: () => {
          /* deprecated noop */
        },
        removeListener: () => {
          /* deprecated noop */
        },
      } satisfies MediaQueryList;
    });
    

    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        provideMockStore({
          initialState: {
            ui: {
              menuOpen: false,
              theme: 'dark',
            },
          },
        }),
      ],
    });

    mockStore = TestBed.inject(MockStore);
    service = TestBed.inject(ThemeService);
  });

  it('should set theme based on prefers-color-scheme if no saved theme', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    service['initializeTheme']();
    expect(dispatchSpy).toHaveBeenCalledWith(setTheme({ theme: 'dark' }));
  });

  it('should apply theme and set meta tag color', () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    expect(meta).toBeTruthy();

    service['applyTheme']('light');
    expect(document.documentElement.classList.contains('light-theme')).toBeTrue();
    expect(meta?.getAttribute('content')).toBe('#ffffff');

    service['applyTheme']('dark');
    expect(document.documentElement.classList.contains('dark-theme')).toBeTrue();
    expect(meta?.getAttribute('content')).toBe('#000000');
  });

  it('should save theme to localStorage', () => {
    const setItemSpy = spyOn(localStorage, 'setItem');
    service['saveThemeToStorage']('light');
    expect(setItemSpy).toHaveBeenCalledWith('movie-library-theme', 'light');
  });
});
