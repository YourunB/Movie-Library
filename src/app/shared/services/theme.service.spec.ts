import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ThemeService } from './theme.service';

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
              theme: 'dark'
            }
          }
        })
      ]
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

  it('should toggle theme correctly', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    service.toggleTheme();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should set theme correctly', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    service.setTheme('light');
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
