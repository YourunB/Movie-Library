import { TestBed } from '@angular/core/testing';
import { SignupService } from './signup.service';
import { UserCredential } from 'firebase/auth';

describe('SignupService', () => {
  let service: SignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignupService],
    });
    service = TestBed.inject(SignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new user with Firebase (integration test)', async () => {
    const email = `test_${Date.now()}@example.com`;
    const password = 'Test123!';

    const result: UserCredential = await service.createNewUser(email, password);

    expect(result.user.email).toBe(email);
    expect(result.user.uid).toBeDefined();
  });
});
