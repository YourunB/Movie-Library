import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninPage } from './signin.page';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ElementRef, QueryList } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SigninPage', () => {
  let component: SigninPage;
  let fixture: ComponentFixture<SigninPage>;

  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select').and.returnValue(of({})),
  };

  const signupServiceMock = {
    createNewUser: jasmine.createSpy('createNewUser'),
  };

  const authServiceMock = {
    setPreuser: jasmine.createSpy('setPreuser'),
    setUser: jasmine.createSpy('setUser'),
  };

  const dialogMock = {
    open: jasmine.createSpy('open'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SigninPage,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: 'SignupService', useValue: signupServiceMock },
        { provide: 'AuthService', useValue: authServiceMock },
        { provide: 'MatDialog', useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SigninPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
  });
  afterEach(() => {
    (localStorage.setItem as jasmine.Spy).calls.reset();
    (localStorage.removeItem as jasmine.Spy).calls.reset();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with email and password controls', () => {
    expect(component.singinForm.contains('email')).toBeTrue();
    expect(component.singinForm.contains('password')).toBeTrue();
  });

  it('should toggle password visibility when hidePassword is called', () => {
    expect(component.isHide).toBeTrue();
    component.hidePassword(new MouseEvent('click'));
    expect(component.isHide).toBeFalse();
    component.hidePassword(new MouseEvent('click'));
    expect(component.isHide).toBeTrue();
  });

  it('userEmailErrors should return correct messages', () => {
    const emailControl = component.singinForm.get('email');
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    expect(component.userEmailErrors()).toBe('Email is required');

    emailControl?.setValue('wrong');
    expect(component.userEmailErrors()).toBe('Email is invalid');

    emailControl?.setValue('valid@mail.com');
    expect(component.userEmailErrors()).toBeNull();
  });

  it('passWordErrors should return correct messages', () => {
    const passwordControl = component.singinForm.get('password');
    passwordControl?.setValue('');
    expect(component.passWordErrors()).toBe('Password is required');

    passwordControl?.setValue('123');
    expect(component.passWordErrors()).toBe(
      'Password must be at least 6 characters long'
    );

    passwordControl?.setErrors({ weakPassword: true });
    expect(component.passWordErrors()).toContain('Password is too weak');

    passwordControl?.setValue('Strong123!');
    passwordControl?.setErrors(null);
    expect(component.passWordErrors()).toBeNull();
  });

  it('should mark email as touched if errors exist', () => {
    const control = component.singinForm.get('email');
    control?.setErrors({ required: true });
    spyOn(control!, 'markAsTouched');
    component.markEmailAsTouched();
    expect(control?.markAsTouched).toHaveBeenCalled();
  });

  it('should mark password as touched if errors exist', () => {
    const control = component.singinForm.get('password');
    control?.setErrors({ required: true });
    spyOn(control!, 'markAsTouched');
    component.markPasswordAsTouched();
    expect(control?.markAsTouched).toHaveBeenCalled();
  });

  it('should not submit if form is invalid and call focusFirstInvalidControl', () => {
    spyOn(
      component as unknown as { focusFirstInvalidControl: () => void },
      'focusFirstInvalidControl'
    );
    component.singinForm.get('email')?.setValue('');
    component.singinForm.get('password')?.setValue('');
    component.onSubmit();
    expect(
      (component as unknown as { focusFirstInvalidControl: () => void })
        .focusFirstInvalidControl
    ).toHaveBeenCalled();
  });

  it('should mark password as invalid if async validator fails', async () => {
    const control = component.singinForm.get('password');
    control?.setValue('weakpass');
    await control?.updateValueAndValidity();
    control?.setErrors({ weakPassword: true });
    expect(control?.invalid).toBeTrue();
    expect(component.passWordErrors()).toContain('Password is too weak');
  });

  it('should focus and scroll to first invalid input', () => {
    const mockInput = new ElementRef(document.createElement('input'));
    mockInput.nativeElement.setAttribute('formcontrolname', 'email');
    spyOn(mockInput.nativeElement, 'focus');
    spyOn(mockInput.nativeElement, 'scrollIntoView');

    component.inputs = new QueryList<ElementRef<HTMLInputElement>>();
    Object.defineProperty(component.inputs, '_results', {
      value: [mockInput],
    });

    component.singinForm.get('email')?.setErrors({ required: true });
    component.singinForm.get('password')?.setValue('ValidPass123');

    (
      component as unknown as { focusFirstInvalidControl: () => void }
    ).focusFirstInvalidControl();

    expect(mockInput.nativeElement.focus).toHaveBeenCalled();
  });
});
