import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToggleSectionComponent } from './toggle-section';

@Component({
  template: `
    <app-toggle-section
      [primaryLabel]="pl"
      [secondaryLabel]="sl"
      [active]="active"
      [hint]="hint"
    >
      <ng-template #primary>Primary Content</ng-template>
      <ng-template #secondary>Secondary Content</ng-template>
    </app-toggle-section>
  `,
  imports: [ToggleSectionComponent, CommonModule],
  standalone: true,
})
class HostComponent {
  pl = 'Primary';
  sl = 'Secondary';
  active: 'primary' | 'secondary' = 'primary';
  hint: string | null = null;

  @ViewChild(ToggleSectionComponent) child!: ToggleSectionComponent;
}

describe('ToggleSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    })
      .overrideComponent(ToggleSectionComponent, {
        set: {
          imports: [CommonModule],
          template: `
            <div class="toggle-section">
              <div class="controls">
                <button class="btn-primary" (click)="setActive('primary')">{{ primaryLabel }}</button>
                <button class="btn-secondary" (click)="setActive('secondary')">{{ secondaryLabel }}</button>
              </div>

              <div class="hint" *ngIf="hint">{{ hint }}</div>

              <ng-container *ngIf="active === 'primary'">
                <ng-container *ngTemplateOutlet="primaryTpl"></ng-container>
              </ng-container>
              <ng-container *ngIf="active === 'secondary'">
                <ng-container *ngTemplateOutlet="secondaryTpl"></ng-container>
              </ng-container>
            </div>
          `,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function textContent(selector: string): string | null {
    const el = fixture.nativeElement.querySelector(selector) as HTMLElement | null;
    return el ? el.textContent?.trim() ?? '' : null;
  }

  it('should create', () => {
    expect(host).toBeTruthy();
    expect(host.child).toBeTruthy();
  });

  it('has correct defaults', () => {
    expect(host.child.primaryLabel).toBe('Primary');
    expect(host.child.secondaryLabel).toBe('Secondary');
    expect(host.child.active).toBe('primary');
    expect(host.child.hint).toBeNull();
    expect(host.child.isSwitching).toBeFalse();
  });

  it('renders primary content by default', () => {
    expect(textContent('.toggle-section')).toContain('Primary Content');
    expect(textContent('.toggle-section')).not.toContain('Secondary Content');
  });

  it('switches to secondary via method call', () => {
    host.child.setActive('secondary');
    fixture.detectChanges();

    expect(host.child.active).toBe('secondary');
    expect(textContent('.toggle-section')).toContain('Secondary Content');
    expect(textContent('.toggle-section')).not.toContain('Primary Content');
  });

  it('does nothing if setActive is called with the same target', () => {
    host.child.isSwitching = true;
    host.child.setActive('primary');
    fixture.detectChanges();

    expect(host.child.active).toBe('primary');
    expect(host.child.isSwitching).toBeTrue();
  });

  it('resets isSwitching to false when switching between tabs', () => {
    host.child.isSwitching = true;
    host.child.setActive('secondary');
    fixture.detectChanges();

    expect(host.child.active).toBe('secondary');
    expect(host.child.isSwitching).toBeFalse();
  });

  it('button clicks change active section', () => {
    const btnSecondary = fixture.debugElement.query(By.css('.btn-secondary')).nativeElement as HTMLButtonElement;
    btnSecondary.click();
    fixture.detectChanges();

    expect(host.child.active).toBe('secondary');
    expect(textContent('.toggle-section')).toContain('Secondary Content');

    const btnPrimary = fixture.debugElement.query(By.css('.btn-primary')).nativeElement as HTMLButtonElement;
    btnPrimary.click();
    fixture.detectChanges();

    expect(host.child.active).toBe('primary');
    expect(textContent('.toggle-section')).toContain('Primary Content');
  });

  it('renders labels on buttons (default and custom)', () => {
    expect(textContent('.btn-primary')).toBe('Primary');
    expect(textContent('.btn-secondary')).toBe('Secondary');
    host.pl = 'Details';
    host.sl = 'Reviews';
    fixture.detectChanges();

    expect(textContent('.btn-primary')).toBe('Details');
    expect(textContent('.btn-secondary')).toBe('Reviews');
  });

  it('shows and hides hint when input changes', () => {
    expect(fixture.nativeElement.querySelector('.hint')).toBeFalsy();

    host.hint = 'Tap to switch';
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.hint') as HTMLElement | null;
    expect(hint?.textContent?.trim()).toBe('Tap to switch');

    host.hint = null;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.hint')).toBeFalsy();
  });

  it('renders secondary content when host sets active input initially', () => {
    const newFixture = TestBed.createComponent(HostComponent);
    const newHost = newFixture.componentInstance;
    newHost.active = 'secondary';
    newFixture.detectChanges();

    expect(newHost.child.active).toBe('secondary');
    expect((newFixture.nativeElement as HTMLElement).textContent).toContain('Secondary Content');
  });
});
