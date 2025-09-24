import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export interface MovieCardModel {
  id: number;
  title: string;
  poster_path: string | null | undefined;
  release_date?: string | null | undefined;
  inWatchlist?: boolean | null | undefined;
};

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatIconModule, RouterLink],
  template: `
    <a [routerLink]="['/movie', movie.id]" class="movie-link" *ngIf="movie">
      <mat-card class="movie-card" [ngClass]="{
          'movie-card--compact': variant === 'compact',
          'movie-card--watchlist': variant === 'watchlist'
        }" (click)="cardClick.emit(movie)">
        <div class="img-wrapper">
          <img
            mat-card-image
            [src]="posterUrl"
            [alt]="movie.title"
            loading="lazy"
            decoding="async"
          />
        </div>
        <mat-card-content class="content">
          <h3 class="title">{{ movie.title }}</h3>
          <p class="release" *ngIf="movie.release_date as rd">{{ rd | date: 'longDate' }}</p>
          <mat-icon
            *ngIf="showFavorite"
            [ngClass]="{ 'in-watchlist': movie.inWatchlist }"
            class="favorite-icon"
            (click)="onFavoriteClick($event)"
            >favorite</mat-icon
          >
        </mat-card-content>
      </mat-card>
    </a>
  `,
  styleUrls: ['./movie-card.scss'],
})
export class MovieCardComponent {
  @Input() movie!: MovieCardModel | null;
  @Input() posterUrl = 'images/placeholder.jpg';
  @Input() showFavorite = false;
  @Input() variant: 'default' | 'compact' | 'watchlist' = 'default';

  @Output() favorite = new EventEmitter<MovieCardModel>();
  @Output() cardClick = new EventEmitter<MovieCardModel>();

  onFavoriteClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.movie) {
      this.favorite.emit(this.movie);
    }
  }
}


