import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { TmdbMovie } from '../../../models/dashboard';
import { AuthService } from './auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class WatchlistSignalsStore {
  private auth = inject(AuthService);

  private readonly favoritesSig = signal<TmdbMovie[]>([]);
  private readonly loadingSig = signal<boolean>(false);
  private readonly errorSig = signal<string | null>(null);

  private readonly isAuthenticated = toSignal(
    this.auth.getAuthenticatedObservable(),
    { initialValue: false }
  );
  private readonly userSig = toSignal(this.auth.getUserObservable(), {
    initialValue: null,
  });


  readonly favorites = computed(() => this.favoritesSig());
  readonly favoritesCount = computed(() => this.favoritesSig().length);
  readonly isEmpty = computed(() => this.favoritesSig().length === 0);
  readonly idsSet = computed(() => new Set(this.favoritesSig().map((m) => m.id)));

  private storageKey = computed(() => {
    const uid = this.userSig()?.uid ?? 'anonymous';
    return `watchlist:${uid}`;
  });

  constructor() {
    effect(() => {
      this.isAuthenticated();
      const key = this.storageKey();
      this.loadingSig.set(true);
      try {
        const raw = localStorage.getItem(key);
        const parsed: TmdbMovie[] = raw ? JSON.parse(raw) : [];
        this.favoritesSig.set(Array.isArray(parsed) ? parsed : []);
        this.errorSig.set(null);
      } catch {
        this.errorSig.set('Failed to load watchlist');
      } finally {
        this.loadingSig.set(false);
      }
    });

    effect(() => {
      const key = this.storageKey();
      const favs = this.favoritesSig();
      untracked(() => {
        try {
          localStorage.setItem(key, JSON.stringify(favs));
        } catch {
          this.errorSig.set('Failed to save watchlist');
        }
      });
    });
  }


  readonly loading = computed(() => this.loadingSig());
  readonly error = computed(() => this.errorSig());
  
  add(movie: TmdbMovie): void {
    const ids = this.idsSet();
    if (ids.has(movie.id)) return;
    this.favoritesSig.set([...this.favoritesSig(), movie]);
  }

  removeById(movieId: number): void {
    this.favoritesSig.set(
      this.favoritesSig().filter((m) => m.id !== movieId)
    );
  }

  toggle(movie: TmdbMovie): void {
    const ids = this.idsSet();
    if (ids.has(movie.id)) {
      this.removeById(movie.id);
    } else {
      this.add(movie);
    }
  }

  isInWatchlist(movieId: number): boolean {
    return this.idsSet().has(movieId);
  }
}


