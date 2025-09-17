import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { map, Observable, startWith } from 'rxjs';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';
import { BreakpointObserver } from '@angular/cdk/layout';

interface NowPlayingMovie {
  id: number;
  title: string;
  imgSrc: string | null;
  releaseDate: string;
}

@Component({
  selector: 'app-now-playing-movies',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './now-playing-movies.html',
  styleUrls: ['./now-playing-movies.scss']
})
export class NowPlayingMovies {
  private tmdb = inject(TmdbService);
  private breakpoint = inject(BreakpointObserver);
  cardWidth = 200;

  @ViewChild('slider', { static: false }) sliderRef!: ElementRef<HTMLDivElement>;

  movies$: Observable<NowPlayingMovie[]> = this.tmdb.getNowPlayingMovies().pipe(
    map((res: TmdbPage<TmdbMovie>) =>
      res.results.slice(0, 12).map((m: TmdbMovie) => ({
        id: m.id,
        title: m.title,
        imgSrc: this.tmdb.img(m.poster_path, 'w342') ?? 'assets/placeholder.jpg',
        releaseDate: m.release_date ?? ''
      }))
    )
  );

  cardWidth$: Observable<number> = this.breakpoint.observe([
    '(max-width: 400px)',
    '(max-width: 576px)',
    '(max-width: 768px)',
    '(max-width: 992px)',
    '(max-width: 1200px)',
  ]).pipe(
    map(result => {
      if (result.breakpoints['(max-width: 400px)']) return 140;
      if (result.breakpoints['(max-width: 576px)']) return 160;
      if (result.breakpoints['(max-width: 768px)']) return 180;
      if (result.breakpoints['(max-width: 992px)']) return 200;
      if (result.breakpoints['(max-width: 1200px)']) return 220;
      return 240;
    }),
    startWith(200) // default before first detection
  );

  scroll(direction: 'prev' | 'next', cardWidth: number): void {
    if (!this.sliderRef) return;
    const slider = this.sliderRef.nativeElement;
    slider.scrollBy({
      left: direction === 'next' ? cardWidth * 3 : -cardWidth * 3,
      behavior: 'smooth'
    });
  }
}
