import { FormControl, ValidationErrors } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';
import { strongPasswordValidator } from './strong-password';

describe('strongPasswordValidator', () => {
  it('should return weakPassword error for a weak password', fakeAsync(() => {
    const control = new FormControl('weak');
    let result: ValidationErrors | null = null;

    strongPasswordValidator()(control).subscribe((res) => {
      result = res;
    });

    tick(500);

    expect(result).not.toBeNull();

    expect((result as unknown as ValidationErrors)['weakPassword']).toEqual({
      hasUpperCase: false,
      hasLowerCase: true,
      hasNumber: false,
      hasSpecialChar: false,
      isLongEnough: false,
    }); 
  }));
});
