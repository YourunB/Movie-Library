import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
import { ErrorDialog } from '../../shared/components/error.dialog/error.dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { TranslatePipe } from '@ngx-translate/core';
import { SignInUpFormData } from '../../../models/dashboard';

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
    TranslatePipe,
  ],
  templateUrl: './signin.page.html',
  styleUrl: './signin.page.scss',
  encapsulation: ViewEncapsulation.None,
})

export class SigninPage implements OnInit {
  @Input() title!: string;
  @Input() preUserData!: SignInUpFormData
  singinForm!: FormGroup;
  private signinService = inject(SigninService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogError = inject(MatDialog);
  watchListService = inject(WatchlistService);
  isHide = true;

  ngOnInit() {
    console.log(this.preUserData, 'signin');
    this.singinForm = new FormGroup({
      email: new FormControl(this.preUserData ? this.preUserData.email : '', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(
        this.preUserData ? this.preUserData.password : '',
        {
          validators: [Validators.required, Validators.minLength(6)],
        }
      ),
    });
    this.singinForm.valueChanges.subscribe((value: SignInUpFormData) => {
      this.authService.setPreuser(value);
    });
  }

  hidePassword(event: MouseEvent) {
    event.stopPropagation();
    this.isHide = !this.isHide;
    event.preventDefault();
  }

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
      const loginData: SignInUpFormData = this.singinForm.value;
      this.signinService
        .signin(loginData.email, loginData.password)
        .then((userCredential) => {
          this.authService.setUser(userCredential.user);
          this.watchListService.receiveDataBaseOfUserMovies();
          this.router.navigate(['./']);
        })
        .catch((error: HttpErrorResponse) => {
          this.dialogError.open(ErrorDialog, {
            data: { message: error.message },
          });
        });
    }
  }
}
