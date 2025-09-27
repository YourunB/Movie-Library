import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

// Harnesses
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { MatIconHarness } from '@angular/material/icon/testing';

class ThemeServiceStub {
  private _theme$ = new BehaviorSubject<'light' | 'dark'>('dark');
  theme$ = this._theme$.asObservable();
  toggleTheme = jasmine.createSpy('toggleTheme').and.callFake(() => {
    this._theme$.next(this._theme$.value === 'dark' ? 'light' : 'dark');
  });
}

describe('ThemeToggle', () => {
  let fixture: ComponentFixture<ThemeToggle>;
  let component: ThemeToggle;
  let loader: HarnessLoader;
  let svc: ThemeServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggle, NoopAnimationsModule],
      providers: [{ provide: ThemeService, useClass: ThemeServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    svc = TestBed.inject(ThemeService) as unknown as ThemeServiceStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows correct icon and tooltip in dark mode (initial)', async () => {
    const icon = await loader.getHarness(MatIconHarness);
    expect(await icon.getName()).toBe('light_mode');

    const tooltip = await loader.getHarness(MatTooltipHarness.with({ selector: 'button' }));
    await tooltip.show();
    expect(await tooltip.getTooltipText()).toBe('Switch to light mode');
    await tooltip.hide();
  });

  it('toggles theme and updates icon + tooltip', async () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(svc.toggleTheme).toHaveBeenCalledTimes(1);

    const icon = await loader.getHarness(MatIconHarness);
    expect(await icon.getName()).toBe('dark_mode');
    const tooltip = await loader.getHarness(MatTooltipHarness.with({ selector: 'button' }));
    await tooltip.show();
    expect(await tooltip.getTooltipText()).toBe('Switch to dark mode');
    await tooltip.hide();
  });
});
