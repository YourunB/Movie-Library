import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of, switchMap, catchError } from 'rxjs';

import { TmdbService } from '../../services/dashboard/tmdb.service';

export interface TrailerModalData {
  movieTitle: string;
  movieId?: number;
}

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './trailer-modal.html',
  styleUrl: './trailer-modal.scss'
})
export class TrailerModal {
  private tmdbService = inject(TmdbService);
  private sanitizer = inject(DomSanitizer);

  loading = true;
  videoKey: string | null = null;
  safeUrl: SafeResourceUrl | null = null;
  error: string | null = null;

  public dialogRef = inject(MatDialogRef<TrailerModal>);
  public data = inject(MAT_DIALOG_DATA) as TrailerModalData;

  constructor() {
    this.loadTrailer();
  }

  private loadTrailer(): void {
    if (!this.data.movieId) {
      this.error = 'Movie ID not provided';
      this.loading = false;
      return;
    }

    this.tmdbService.getMovieVideos(this.data.movieId).pipe(
      switchMap((response) => {
        const trailer =
          response.results?.find(v =>
            v.site === 'YouTube' &&
            v.type === 'Trailer' &&
            v.name?.toLowerCase().includes('official')
          ) ||
          response.results?.find(v =>
            v.site === 'YouTube' && v.type === 'Trailer'
          );

        if (trailer) {
          this.videoKey = trailer.key;
          const url = `https://www.youtube.com/embed/${this.videoKey}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
          this.error = 'No official trailer found for this movie';
        }

        this.loading = false;
        return of(null);
      }),
      catchError(() => {
        this.error = 'Failed to load trailer';
        this.loading = false;
        return of(null);
      })
    ).subscribe();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  openInYouTube(): void {
    if (this.videoKey) {
      window.open(`https://www.youtube.com/watch?v=${this.videoKey}`, '_blank');
    } else {
      this.openYouTubeSearch();
    }
  }

  openYouTubeSearch(): void {
    const q = encodeURIComponent(this.data.movieTitle + ' trailer');
    window.open(`https://www.youtube.com/results?search_query=${q}`, '_blank');
  }
}
