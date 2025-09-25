import { Component, inject, ElementRef, viewChild, computed, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { map, startWith, take } from 'rxjs';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { MovieCardComponent } from '../../../shared/components/movie-card/movie-card';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';

type ViewMovie = Omit<TmdbMovie, 'poster_path' | 'release_date'> & {
  poster_path: string;
  release_date: string;
};

@Component({
  selector: 'app-now-playing-movies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MovieCardComponent,
    TranslatePipe
  ],
  templateUrl: './now-playing-movies.html',
  styleUrls: ['./now-playing-movies.scss'],
})
export class NowPlayingMovies {
  private tmdb = inject(TmdbService);
  private breakpoint = inject(BreakpointObserver);
  authService = inject(AuthService);
  watchListService = inject(WatchlistService);

  isAuth = toSignal(this.authService.getAuthenticatedObservable(), { initialValue: false });
  private moviesPageSig = toSignal(this.tmdb.getNowPlayingMovies(), { initialValue: null });
  movies = computed<ViewMovie[]>(() => {
    const page = this.moviesPageSig() as TmdbPage<TmdbMovie> | null;
    const results = page?.results ?? [];
    return results.slice(0, 12).map((m): ViewMovie => ({
      ...m,
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
    const slider = this.sliderRef()?.nativeElement;
    if (!slider) return;
    untracked(() => {
      slider.scrollBy({
        left: direction === 'next' ? cardWidth * 3 : -cardWidth * 3,
        behavior: 'smooth',
      });
    });
  }
  toggleFavorite(movie: ViewMovie): void {
    this.watchListService
      .isMovieInWatchlist(movie.id)
      .pipe(take(1))
      .subscribe((isInWatchlist) => {
        if (isInWatchlist) {
          this.watchListService.removeMovie(movie.id);
        } else {
          this.watchListService.addMovie(movie as unknown as TmdbMovie);
        }
      });
  }
}
