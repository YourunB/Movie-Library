import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { Observable } from 'rxjs';
import { WatchlistSignalsStore } from '../../shared/services/watchlist-signals.store';
import { TmdbMovie } from '../../../models/dashboard';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../shared/services/auth.service';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import {
  MovieCardComponent,
  MovieCardModel,
} from '../../shared/components/movie-card/movie-card';
import { PosterUrlPipe } from '../../shared/pipes/poster-url.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-watchlist.page',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    RouterLink,
    MatCardModule,
    MovieCardComponent,
    PosterUrlPipe,
    TranslatePipe,
  ],
  templateUrl: './watchlist.page.html',
  styleUrl: './watchlist.page.scss',
})
export class WatchlistPage {
  @Input() title!: string;
  public tmdb = inject(TmdbService);
  authService = inject(AuthService);
  watchListService = inject(WatchlistService);
  watchlistSignals = inject(WatchlistSignalsStore);

  isAuth$: Observable<boolean>;

  constructor() {
    this.isAuth$ = this.authService.authenticatedSubject;
  }

  toggleFavorite(movie: MovieCardModel): void {
    const normalized: TmdbMovie = {
      ...(movie as unknown as TmdbMovie),
      poster_path: movie.poster_path ?? null,
      release_date: movie.release_date ?? null,
    };
    this.watchlistSignals.toggle(normalized);
  }
}
