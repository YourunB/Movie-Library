import { TestBed } from '@angular/core/testing';

import { AuthService } from '../services/auth.service';
import { SignInUpFormData } from '../../../models/dashboard';
import { PreUserResolver } from './signinup.resolver';

describe('PreUserResolver', () => {
  let resolver: PreUserResolver;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockPreuser: SignInUpFormData = {
    email: 'test@example.com',
    password: 'Test123!',
  };

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getPreuser']);
    authServiceMock.getPreuser.and.returnValue(mockPreuser);

    TestBed.configureTestingModule({
      providers: [
        PreUserResolver,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    resolver = TestBed.inject(PreUserResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve preuser data from AuthService', (done) => {
    resolver.resolve().subscribe((result: SignInUpFormData) => {
      expect(result).toEqual(mockPreuser);
      expect(authServiceMock.getPreuser).toHaveBeenCalled();
      done();
    });
  });
});
