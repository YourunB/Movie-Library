import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadMovieById } from '../../../store/dashboard/dashboard.actions';
import {
  selectLoadingMovie,
  selectSelectedMovie,
} from '../../../store/dashboard/dashboard.selectors';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { TmdbMovie } from '../../../models/dashboard';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit, OnChanges {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  authService = inject(AuthService);

  movie$ = this.store.select(selectSelectedMovie);
  loading$ = this.store.select(selectLoadingMovie);
  watchListService = inject(WatchlistService);

  isAuth$: Observable<boolean>;
  constructor() {
    this.isAuth$ = this.authService.authenticatedSubject;
  }

   ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      console.log(`Previous ${inputName} == ${inputValues.previousValue}`);
      console.log(`Current ${inputName} == ${inputValues.currentValue}`);
      console.log(`Is first ${inputName} change == ${inputValues.firstChange}`);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(loadMovieById({ id: id }));
      }
    });
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
