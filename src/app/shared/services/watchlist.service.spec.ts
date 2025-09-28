import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TmdbMovie } from '../../../models/dashboard';
import { selectFavoriteMovies } from '../../../store/watchlist/watchlist.selectors';
import {
  addMovie,
  deleteMovieById,
  loadListOfMovies,
} from '../../../store/watchlist/watchlist.actions';
import { auth } from '../api/farebase';
import { User } from 'firebase/auth';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let store: MockStore;
  const mockMovie: TmdbMovie = { id: 1, title: 'Test Movie' } as TmdbMovie;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchlistService, provideMockStore()],
    });

    service = TestBed.inject(WatchlistService);
    store = TestBed.inject(MockStore);

    Object.defineProperty(auth, 'currentUser', {
      value: {
        uid: 'user123',
        email: 'test@example.com',
        _stopProactiveRefresh: () => {
          /*test*/
        },
      } as unknown as User,
      writable: true,
    });

    spyOn(service, 'updateDataBaseOfUserMovies').and.callFake((): void => {
      /*test*/
    });
    spyOn(service, 'receiveDataBaseOfUserMovies').and.callFake((): void => {
      const user = auth.currentUser;
      const movies = user ? [mockMovie] : [];
      store.dispatch(loadListOfMovies({ movies }));
    });
  });

  it('should dispatch addMovie and update database', () => {
    store.overrideSelector(selectFavoriteMovies, [mockMovie]);
    const dispatchSpy = spyOn(store, 'dispatch');
    service.addMovie(mockMovie);
    expect(dispatchSpy).toHaveBeenCalledWith(addMovie({ movie: mockMovie }));
    expect(service.updateDataBaseOfUserMovies).toHaveBeenCalled();
  });

  it('should dispatch deleteMovieById and update database', () => {
    store.overrideSelector(selectFavoriteMovies, [mockMovie]);
    const dispatchSpy = spyOn(store, 'dispatch');
    service.removeMovie(mockMovie.id);
    expect(dispatchSpy).toHaveBeenCalledWith(deleteMovieById({ movieId: mockMovie.id }));
    expect(service.updateDataBaseOfUserMovies).toHaveBeenCalled();
  });

  it('should check if movie is in watchlist', (done: DoneFn) => {
    store.overrideSelector(selectFavoriteMovies, [mockMovie]);
    service.isMovieInWatchlist(mockMovie.id).subscribe((result: boolean) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should receive movies from database and dispatch loadListOfMovies', () => {
    store.overrideSelector(selectFavoriteMovies, [mockMovie]);
    const dispatchSpy = spyOn(store, 'dispatch');
    service.receiveDataBaseOfUserMovies();
    expect(dispatchSpy).toHaveBeenCalledWith(loadListOfMovies({ movies: [mockMovie] }));
  });

  it('should dispatch empty list if no user', () => {
    Object.defineProperty(auth, 'currentUser', {
      value: null,
      writable: true,
    });
    store.overrideSelector(selectFavoriteMovies, []);
    const dispatchSpy = spyOn(store, 'dispatch');
    service.receiveDataBaseOfUserMovies();
    expect(dispatchSpy).toHaveBeenCalledWith(loadListOfMovies({ movies: [] }));
  });
});
