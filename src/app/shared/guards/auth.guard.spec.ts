import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injector, runInInjectionContext } from '@angular/core';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;

    localStorage.removeItem('userUID');
  });

  it('should allow access if user is authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    const result = runInInjectionContext(TestBed.inject(Injector), () =>
      authGuard(route, state)
    );

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should allow access if userUID exists in localStorage', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    localStorage.setItem('userUID', 'mock-uid');

    const result = runInInjectionContext(TestBed.inject(Injector), () =>
      authGuard(route, state)
    );

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect if not authenticated and no userUID', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);

    const result = runInInjectionContext(TestBed.inject(Injector), () =>
      authGuard(route, state)
    );

    expect(result).toBeFalse();
  });
});
