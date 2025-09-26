import { inject, Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { TmdbMovie } from '../../../models/dashboard';
import { Store } from '@ngrx/store';
import { WatchListState } from '../../../store/watchlist/watchlist.store';
import { selectFavoriteMovies } from '../../../store/watchlist/watchlist.selectors';
import {
  addMovie,
  deleteMovieById,
  loadListOfMovies,
} from '../../../store/watchlist/watchlist.actions';
import { database } from '../api/farebase';
import { User } from 'firebase/auth';
import { child, get, push, ref, update } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private store = inject(Store<WatchListState>);
  watchlist$: Observable<TmdbMovie[]>;
  private dataBase = database;
  user: User | null = null;
  constructor() {
    this.watchlist$ = this.store.select(selectFavoriteMovies);
  }

  removeMovie(movieId: number) {
    console.log('remove');
    this.store.dispatch(deleteMovieById({ movieId: movieId }));
    this.updateDataBaseOfUserMovies();
  }

  addMovie(movie: TmdbMovie) {
    this.store.dispatch(addMovie({ movie: movie }));
    this.updateDataBaseOfUserMovies();
  }

  isMovieInWatchlist(movieId: number): Observable<boolean> {
    return this.watchlist$.pipe(
      map((movies) => movies.some((movie) => movie.id === movieId))
    );
  }

  updateDataBaseOfUserMovies() {
    const newKey = push(child(ref(this.dataBase), 'favorite')).key;
    this.store
      .select(selectFavoriteMovies)
      .pipe(take(1))
      .subscribe((favouritemovies: TmdbMovie[]) => {
        const updates: Record<string, TmdbMovie[]> = {};
        updates[`/favorite/${newKey}`] = favouritemovies;
        update(ref(this.dataBase), updates)
          .then(() => {
            console.log('Database updated successfully!');
          })
          .catch((error) => {
            console.error('Error updating database:', error);
          });
      });
  }

  receiveDataBaseOfUserMovies() {
    const dbRef = ref(this.dataBase);
    get(child(dbRef, `favorite/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data) {
            this.store.dispatch(loadListOfMovies({ movies: data[Object.keys(data)[Object.keys(data).length - 1]] }));
          } else {
            console.warn('No movies data found in snapshot.');
            this.store.dispatch(loadListOfMovies({ movies: [] }));
          }
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
