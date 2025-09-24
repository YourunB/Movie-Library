import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-toggle-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-section.html',
  styleUrls: ['./toggle-section.scss'],
})
export class ToggleSectionComponent {
  @Input() primaryLabel = 'Primary';
  @Input() secondaryLabel = 'Secondary';
  @Input() active: 'primary' | 'secondary' = 'primary';
  @Input() hint: string | null = null;
  isSwitching = false;

  setActive(target: 'primary' | 'secondary') {
    if (this.active === target) return;
    this.active = target;
    this.isSwitching = false;
  }

  @ContentChild('primary', { read: TemplateRef }) primaryTpl!: TemplateRef<unknown>;
  @ContentChild('secondary', { read: TemplateRef }) secondaryTpl!: TemplateRef<unknown>;
}


