import { TestBed } from '@angular/core/testing';
import { WatchlistSignalsStore } from './watchlist-signals.store';
import { WatchlistService } from './watchlist.service';
import { TmdbMovie } from '../../../models/dashboard';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

describe('WatchlistSignalsStore', () => {
  let storeMock: jasmine.SpyObj<Store>;
  let watchlistServiceMock: jasmine.SpyObj<WatchlistService>;
  let favorites$: BehaviorSubject<TmdbMovie[]>;
  let service: WatchlistSignalsStore;

  const mockMovie: TmdbMovie = {
    id: 1,
    title: 'Test Movie',
    overview: '',
    poster_path: '',
    release_date: '',
    vote_average: 0,
  };

  beforeEach(() => {
    favorites$ = new BehaviorSubject<TmdbMovie[]>([]);

    storeMock = jasmine.createSpyObj('Store', ['select']);
    storeMock.select.and.returnValue(favorites$.asObservable());

    watchlistServiceMock = jasmine.createSpyObj('WatchlistService', [
      'addMovie',
      'removeMovie',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: WatchlistService, useValue: watchlistServiceMock },
        WatchlistSignalsStore,
      ],
    });

    service = TestBed.inject(WatchlistSignalsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty favorites initially', () => {
    expect(service.favorites()).toEqual([]);
    expect(service.idsSet().size).toBe(0);
  });

  it('should reflect movie in watchlist after adding', () => {
    favorites$.next([mockMovie]);
    expect(service.favorites()).toEqual([mockMovie]);
    expect(service.isInWatchlist(mockMovie.id)).toBeTrue();
  });

  it('should call addMovie if movie is not in watchlist', () => {
    service.toggle(mockMovie);
    expect(watchlistServiceMock.addMovie).toHaveBeenCalledWith(mockMovie);
    expect(watchlistServiceMock.removeMovie).not.toHaveBeenCalled();
  });

  it('should call removeMovie if movie is already in watchlist', () => {
    favorites$.next([mockMovie]);
    service.toggle(mockMovie);
    expect(watchlistServiceMock.removeMovie).toHaveBeenCalledWith(mockMovie.id);
    expect(watchlistServiceMock.addMovie).not.toHaveBeenCalled();
  });
});
