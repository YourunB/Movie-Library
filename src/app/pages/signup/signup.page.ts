import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';
import { SignupService } from '../../shared/services/signup.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialog } from '../../shared/components/error.dialog/error.dialog';
import { HttpErrorResponse } from '@angular/common/http';

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
  private signupService = inject(SignupService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogError = inject(MatDialog);
  isHide = true;
  constructor() {
    this.signupForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  hidePassword(event: MouseEvent) {
    console.log(event.type);
    event.stopPropagation();
    event.preventDefault();
    this.isHide = !this.isHide;
  }

  markEmailAsTouched() {
    const control = this.signupForm.get('email');
    if (control?.errors) control?.markAsTouched();
  }

  markPasswordAsTouched() {
    const control = this.signupForm.get('password');
    if (control?.errors) control?.markAsTouched();
  }
  userEmailErrors() {
    const control = this.signupForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    } else if (control?.hasError('email')) {
      return 'Email is invalid';
    } else {
      return null;
    }
  }

  passWordErrors() {
    const control = this.signupForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    } else if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    } else {
      return null;
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      this.signupService
        .createNewUser(signupData.email, signupData.password)
        .then((userCredential) => {
          localStorage.setItem('userUID', userCredential.user.uid);
          this.authService.setUser(userCredential.user);
          this.router.navigate(['/']);
        })
        .catch((error: HttpErrorResponse) => {
          console.log(error);
          this.dialogError.open(ErrorDialog, {
            data: { message: error.name },
          });
        });
    }
  }
}
