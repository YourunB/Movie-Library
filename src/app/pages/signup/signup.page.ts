import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup.page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss',
})
export class SignupPage {
  signupForm: FormGroup;
  constructor() {
    this.signupForm = new FormGroup({
      userName: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
    });
  }

  hide = signal(true);
  hidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  protected readonly value = signal('');

  markNameAsTouched() {
    const control = this.signupForm.get('userName');
    if (control?.errors) control?.markAsTouched();
  }

  markPasswordAsTouched() {
    const control = this.signupForm.get('password');
    if (control?.errors) control?.markAsTouched();
  }
  userNameErrors() {
    const control = this.signupForm.get('userName');
    if (control?.hasError('required')) {
      return 'Username is required';
    } else if (control?.hasError('minlength')) {
      return 'Username must be at least 3 characters long';
    } else {
      return null;
    }
  }

  passWordErrors() {
    const control = this.signupForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    } else if (control?.hasError('minlength')) {
      return 'Password must be at least 2 characters long';
    } else {
      return null;
    }
  }

  onSubmit() {
    if (this. signupForm.valid) {
      const signupData = this. signupForm.value;
      console.log(signupData);
    }
  }
}
