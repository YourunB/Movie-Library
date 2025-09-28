import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export function strongPasswordValidator(): (
  control: AbstractControl
) => Observable<ValidationErrors | null> {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value || '';

    return timer(500).pipe(
      map(() => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const isLongEnough = value.length >= 8;

        const isStrong =
          hasUpperCase &&
          hasLowerCase &&
          hasNumber &&
          hasSpecialChar &&
          isLongEnough;

        return isStrong
          ? null
          : {
              weakPassword: {
                hasUpperCase,
                hasLowerCase,
                hasNumber,
                hasSpecialChar,
                isLongEnough,
              },
            };
      })
    );
  };
}
