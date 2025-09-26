import { Injectable, computed, inject } from '@angular/core';
import { TmdbMovie } from '../../../models/dashboard';
import { toSignal } from '@angular/core/rxjs-interop';
import { WatchlistService } from './watchlist.service';
import { Store } from '@ngrx/store';
import { selectFavoriteMovies } from '../../../store/watchlist/watchlist.selectors';

@Injectable({ providedIn: 'root' })
export class WatchlistSignalsStore {
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
    if (ids.has(movie.id)) {
      this.watchListService.removeMovie(movie.id);
    } else {
      this.watchListService.addMovie(movie);
    }
  }

  isInWatchlist(movieId: number): boolean {
    return this.idsSet().has(movieId);
  }
}
