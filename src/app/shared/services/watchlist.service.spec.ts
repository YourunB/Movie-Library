import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';
import { Store } from '@ngrx/store';

describe('WatchlistService', () => {
  let service: WatchlistService;

  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeMock },
      ],
    });

    service = TestBed.inject(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
