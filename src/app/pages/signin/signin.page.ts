import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
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
import { AuthService } from '../../shared/services/auth.service';
import { SigninService } from '../../shared/services/signin.service';
import { ErrorDialog } from '../shared/error.dialog/error.dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { VpnInfoBanner } from '../../shared/components/vpn-info-banner/vpn-info-banner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-signin.page',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterLink,
    VpnInfoBanner,
  ],
  templateUrl: './signin.page.html',
  styleUrl: './signin.page.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SigninPage {
  singinForm: FormGroup;
  private signinService = inject(SigninService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogError = inject(MatDialog);

  constructor() {
    this.singinForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  hide = signal(true);
  hidePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  protected readonly value = signal('');

  markEmailAsTouched() {
    const control = this.singinForm.get('email');
    if (control?.errors) control?.markAsTouched();
  }

  markPasswordAsTouched() {
    const control = this.singinForm.get('password');
    if (control?.errors) control?.markAsTouched();
  }

  userEmailErrors() {
    const control = this.singinForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    } else if (control?.hasError('email')) {
      return 'Email is invalid';
    } else {
      return null;
    }
  }

  passWordErrors() {
    const control = this.singinForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    } else if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    } else {
      return null;
    }
  }

  onSubmit() {
    if (this.singinForm.valid) {
      const loginData = this.singinForm.value;
      this.signinService
        .signin(loginData.email, loginData.password)
        .then((userCredential) => {
          this.authService.setUser(userCredential.user);
          this.router.navigate(['./']);
        })
        .catch((error: HttpErrorResponse) => {
          this.dialogError.open(ErrorDialog, {
            data: { message: error.name },
          });
        });
    }
  }
}
