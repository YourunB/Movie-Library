import { TestBed } from '@angular/core/testing';
import { SigninService } from './signin.service';
import { UserCredential } from 'firebase/auth';

describe('SigninService', () => {
  let service: SigninService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SigninService],
    });
    service = TestBed.inject(SigninService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign in a user with Firebase (integration test)', async () => {
    const email = 'qwer@qwer.by';
    const password = '123456';

    const result: UserCredential = await service.signin(email, password);

    expect(result.user.email).toBe(email);
    expect(result.user.uid).toBeDefined();
  });
});
