import { AuthService } from './auth.service';
import { WatchlistService } from './watchlist.service';
import { SignInUpFormData } from '../../../models/dashboard';
import { TestBed } from '@angular/core/testing';

describe('AuthService', () => {
  let service: AuthService;
  let watchlistSpy: jasmine.SpyObj<WatchlistService>;

  beforeEach(() => {
    watchlistSpy = jasmine.createSpyObj('WatchlistService', ['receiveDataBaseOfUserMovies']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: WatchlistService, useValue: watchlistSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should set and get preUser', () => {
    const preUser: SignInUpFormData = { email: 'test@example.com', password: '123456' };
    service.setPreuser(preUser);
    expect(service.getPreuser()).toEqual(preUser);
  });
});
