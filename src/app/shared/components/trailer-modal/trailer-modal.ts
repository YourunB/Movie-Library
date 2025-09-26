import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of, catchError } from 'rxjs';

import { TmdbService } from '../../services/dashboard/tmdb.service';
import { TranslatePipe } from '@ngx-translate/core';

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
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './trailer-modal.html',
  styleUrl: './trailer-modal.scss',
})
export class TrailerModal {
  private tmdbService = inject(TmdbService);
  private sanitizer = inject(DomSanitizer);

  loading = true;
  videoKey: string | null = null;
  safeUrl: SafeResourceUrl | null = null;
  error: string | null = null;

  movieOverview: string | null = null;
  movieTagline: string | null = null;
  videoName: string | null = null;
  publishedAt?: string;
  descExpanded = false;

  public dialogRef = inject(MatDialogRef<TrailerModal>);
  public data = inject(MAT_DIALOG_DATA) as TrailerModalData;

  constructor() {
    this.loadTrailer();
  }

  private loadTrailer(): void {
    const id = this.data.movieId;
    if (!id) {
      this.error = 'Movie ID not provided';
      this.loading = false;
      return;
    }

    this.tmdbService
      .getTrailerWithOverview(id)
      .pipe(
        catchError(() => {
          this.error = 'Failed to load trailer';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((res) => {
        if (!res) return;

        // Save description/tagline regardless of trailer presence
        this.movieOverview = res.overview || null;
        this.movieTagline = res.tagline || null;

        if (res.trailer?.key) {
          this.videoKey = res.trailer.key;
          this.videoName = res.trailer.name || null;
          this.publishedAt = res.trailer.publishedAt;
          const url = `https://www.youtube.com/embed/${this.videoKey}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
          this.error = 'No trailer found for this movie';
        }

        this.loading = false;
      });
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

  toggleDesc(): void {
    this.descExpanded = !this.descExpanded;
  }
}
