import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { TmdbMovie } from '../../../models/dashboard';
import { Store } from '@ngrx/store';
import { WatchListState } from '../../../store/watchlist/watchlist.store';
import { selectFavoriteMovies } from '../../../store/watchlist/watchlist.selectors';
import {
  addMovie,
  deleteMovieById,
} from '../../../store/watchlist/watchlist.actions';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private store = inject(Store<WatchListState>);
  watchlist$: Observable<TmdbMovie[]>;
  constructor() {
    this.watchlist$ = this.store.select(selectFavoriteMovies);
  }

  removeMovie(movieId: number) {
    this.store.dispatch(deleteMovieById({ movieId: movieId }));
  }

  addMovie(movie: TmdbMovie) {
    this.store.dispatch(addMovie({ movie: movie }));
  }

  isMovieInWatchlist(movieId: number): Observable<boolean> {
    return this.watchlist$.pipe(
      map((movies) => movies.some((movie) => movie.id === movieId))
    );
  }
}
