import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from '../../services/theme.service';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ThemeToggle,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
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
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle theme when button is clicked', () => {
    const toggleSpy = spyOn(themeService, 'toggleTheme');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    expect(toggleSpy).toHaveBeenCalled();
  });
});
