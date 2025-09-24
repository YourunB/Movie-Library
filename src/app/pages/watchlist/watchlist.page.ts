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

@Component({
  selector: 'app-watchlist.page',
  imports: [CommonModule, MatIcon, RouterLink, MatCardModule],
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

  toggleFavorite(event: Event, movie: TmdbMovie): void {
    event.stopPropagation();
    event.preventDefault();
    this.watchListService
      .isMovieInWatchlist(movie.id)
      .pipe(take(1))
      .subscribe((isInWatchlist) => {
        if (isInWatchlist) {
          this.watchListService.removeMovie(movie.id);
        } else {
          this.watchListService.addMovie(movie);
        }
      });
  }
}
