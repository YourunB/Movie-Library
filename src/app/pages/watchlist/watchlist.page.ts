import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { Observable, take } from 'rxjs';
import { TmdbMovie } from '../../../models/dashboard';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../shared/services/auth.service';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { MovieCardComponent, MovieCardModel } from '../../shared/components/movie-card/movie-card';
import { PosterUrlPipe } from '../../shared/pipes/poster-url.pipe';

@Component({
  selector: 'app-watchlist.page',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterLink, MatCardModule, MovieCardComponent, PosterUrlPipe],
  templateUrl: './watchlist.page.html',
  styleUrl: './watchlist.page.scss',
})
export class WatchlistPage implements OnInit {
  public tmdb = inject(TmdbService);
  authService = inject(AuthService);
  watchListService = inject(WatchlistService);

  movies$!: Observable<TmdbMovie[]>;
  isAuth$: Observable<boolean>;

  constructor() {
    this.isAuth$ = this.authService.authenticatedSubject;
  }

  ngOnInit(): void {
    this.movies$ = this.watchListService.watchlist$;
  }

  toggleFavorite(movie: MovieCardModel): void {
    this.watchListService
      .isMovieInWatchlist(movie.id)
      .pipe(take(1))
      .subscribe((isInWatchlist) => {
        if (isInWatchlist) {
          this.watchListService.removeMovie(movie.id);
        } else {
          const normalized: TmdbMovie = {
            ...(movie as unknown as TmdbMovie),
            poster_path: movie.poster_path ?? null,
            release_date: movie.release_date ?? null,
          };
          this.watchListService.addMovie(normalized);
        }
      });
  }
}
