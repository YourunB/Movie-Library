import { Injectable, computed, inject } from '@angular/core';
import { TmdbMovie } from '../../../models/dashboard';
import { AuthService } from './auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { WatchlistService } from './watchlist.service';
import { Store } from '@ngrx/store';
import { selectFavoriteMovies } from '../../../store/watchlist/watchlist.selectors';

@Injectable({ providedIn: 'root' })
export class WatchlistSignalsStore {
  private auth = inject(AuthService);
  watchListService = inject(WatchlistService);
  store = inject(Store);

  private readonly favoritesSig = toSignal(
    this.store.select(selectFavoriteMovies),
    { initialValue: [] as TmdbMovie[] }
  );

  readonly favorites = computed(() => this.favoritesSig());
  readonly idsSet = computed(
    () => new Set(this.favoritesSig().map((m) => m.id))
  );

  toggle(movie: TmdbMovie): void {
    const ids = this.idsSet();
    console.log(ids);
    if (ids.has(movie.id)) {
      console.log('delete');
      console.log(movie);
      console.log(this.favorites);
      this.watchListService.removeMovie(movie.id);
    } else {
      this.watchListService.addMovie(movie);
    }
  }

  isInWatchlist(movieId: number): boolean {
    return this.idsSet().has(movieId);
  }
}
