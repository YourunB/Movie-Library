import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
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
import { TranslatePipe } from '@ngx-translate/core';
import { SignInUpFormData } from '../../../models/dashboard';
import { strongPasswordValidator } from '../../shared/validators/strong-password';
import { PasswordStrengthLineComponent } from '../../shared/components/password-strengh-line/password-strengh-line';

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
    TranslatePipe,
    PasswordStrengthLineComponent,
  ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss',
})
export class SignupPage implements OnInit {
  @Input() title!: string;
  @Input() preUserData!: SignInUpFormData;
  signupForm!: FormGroup;
  private signupService = inject(SignupService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialogError = inject(MatDialog);
  isHide = true;
  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(this.preUserData ? this.preUserData.email : '', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(
        this.preUserData ? this.preUserData.password : '',
        {
          validators: [Validators.required, Validators.minLength(6)],
          asyncValidators: [strongPasswordValidator()],
        }
      ),
    });
    this.signupForm.valueChanges.subscribe((value: SignInUpFormData) => {
      this.authService.setPreuser(value);
    });
    const draft = localStorage.getItem('signupForm');
    if (!this.preUserData) {
      if (draft) {
        this.signupForm.patchValue(JSON.parse(draft));
      }
    }

    this.signupForm.valueChanges.subscribe((value) => {
      localStorage.setItem('signupForm', JSON.stringify(value));
    });
  }

  @ViewChildren('formFieldInput') inputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

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
    } else if (control?.hasError('weakPassword')) {
      return 'Password is too weak. It must contain uppercase, lowercase, number, special character, and be at least 8 characters long.';
    } else {
      return null;
    }
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.focusFirstInvalidControl();
      return;
    }
    if (this.signupForm.valid) {
      const signupData = this.signupForm.value;
      this.signupService
        .createNewUser(signupData.email, signupData.password)
        .then((userCredential) => {
          localStorage.setItem('userUID', userCredential.user.uid);
          this.authService.setUser(userCredential.user);
          localStorage.removeItem('signupForm');
          this.router.navigate(['/']);
        })
        .catch((error: HttpErrorResponse) => {
          console.log(error);
          this.dialogError.open(ErrorDialog, {
            data: { message: error.message },
          });
        });
    }
  }

  private focusFirstInvalidControl() {
    const invalidControlName = Object.keys(this.signupForm.controls).find(
      (key) => this.signupForm.get(key)?.invalid
    );

    if (invalidControlName) {
      const invalidInput = this.inputs.find(
        (input) =>
          input.nativeElement.getAttribute('formcontrolname') ===
          invalidControlName
      );
      invalidInput?.nativeElement.focus();
      invalidInput?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }
}
