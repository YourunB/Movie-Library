import { Component, ElementRef, computed, inject, viewChild, untracked, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { map, startWith } from 'rxjs';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { WatchlistSignalsStore } from '../../../shared/services/watchlist-signals.store';

export interface MovieVM {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

@Component({
  selector: 'app-upcoming-movies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MovieCardComponent,
    TranslatePipe,
  ],
  templateUrl: './upcoming-movies.html',
  styleUrls: ['./upcoming-movies.scss'],
})
export class UpcomingMovies {
  private tmdb = inject(TmdbService);
  private breakpoint = inject(BreakpointObserver);
  authService = inject(AuthService);
  watchListService = inject(WatchlistService);
  watchlistSignals = inject(WatchlistSignalsStore);
  // Section title as a signal input to satisfy signal inputs criterion and simplify API
  title = input('Upcoming');

  isAuth = toSignal(this.authService.getAuthenticatedObservable(), { initialValue: false });

  private moviesPageSig = toSignal<TmdbPage<TmdbMovie> | null>(this.tmdb.getUpcomingMovies(), { initialValue: null });
  movies = computed<MovieVM[]>(() => {
    const res = this.moviesPageSig();
    const results = res?.results ?? [];
    return results.slice(0, 10).map<MovieVM>((m) => ({
      id: m.id,
      title: m.title,
      poster_path: this.tmdb.img(m.poster_path, 'w342') ?? 'assets/placeholder.jpg',
      release_date: m.release_date ?? '',
    }));
  });

  sliderRef = viewChild<ElementRef<HTMLDivElement>>('slider');

  private cardWidth$ = this.breakpoint
    .observe([
      '(max-width: 400px)',
      '(max-width: 576px)',
      '(max-width: 768px)',
      '(max-width: 992px)',
      '(max-width: 1200px)',
    ])
    .pipe(
      map((result) => {
        if (result.breakpoints['(max-width: 400px)']) return 140;
        if (result.breakpoints['(max-width: 576px)']) return 160;
        if (result.breakpoints['(max-width: 768px)']) return 180;
        if (result.breakpoints['(max-width: 992px)']) return 200;
        if (result.breakpoints['(max-width: 1200px)']) return 220;
        return 240;
      }),
      startWith(200)
    );
  cardWidth = toSignal(this.cardWidth$, { initialValue: 200 });

  scroll(direction: 'prev' | 'next', cardWidth: number): void {
    const sliderEl = this.sliderRef()?.nativeElement;
    if (!sliderEl) return;
    // Use untracked to avoid enqueuing change detection/recomputes for a pure DOM side effect
    // (scrolling) that shouldn't trigger reactive updates.
    untracked(() => {
      sliderEl.scrollBy({
        left: direction === 'next' ? cardWidth * 3 : -cardWidth * 3,
        behavior: 'smooth',
      });
    });
  }

  toggleFavorite(movie: MovieVM): void {
    // Route write through signals store to make it the single source of truth
    this.watchlistSignals.toggle(movie as unknown as TmdbMovie);
  }
}
