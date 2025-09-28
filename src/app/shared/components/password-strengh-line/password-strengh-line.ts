import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-password-strength-line',
  templateUrl: './password-strengh-line.html',
  styleUrls: ['./password-strengh-line.scss'],
})
export class PasswordStrengthLineComponent implements OnChanges {
  @Input() password = '';

  score = 0;            // 0..100
  label: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  color: 'weak' | 'medium' | 'strong' = 'weak';

  ngOnChanges(): void {
    this.updateStrength(this.password || '');
  }

  private updateStrength(value: string): void {
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(value);
    const lengthScore = Math.min(value.length, 12) / 12; 

    const criteriaPoints =
      (hasLower ? 1 : 0) +
      (hasUpper ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecial ? 1 : 0);

    const base = criteriaPoints / 4;
    const score = Math.round((base * 0.7 + lengthScore * 0.3) * 100);

    this.score = score;

    if (score < 40 || value.length < 8 || criteriaPoints < 3) {
      this.label = 'Weak';
      this.color = 'weak';
    } else if (score < 75) {
      this.label = 'Medium';
      this.color = 'medium';
    } else {
      this.label = 'Strong';
      this.color = 'strong';
    }
  }
}
