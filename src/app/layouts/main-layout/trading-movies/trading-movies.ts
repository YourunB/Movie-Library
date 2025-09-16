import { Component, inject, ViewChild } from '@angular/core';
import {
  CarouselCaptionComponent,
  CarouselComponent,
  CarouselControlComponent,
  CarouselInnerComponent,
  CarouselItemComponent
} from '@coreui/angular';
import { Store } from '@ngrx/store';
import { selectTrending } from '../../../../store/dashboard.selectors';
import { loadDashboard } from '../../../../store/dashboard.actions';
import { map } from 'rxjs';
import { TmdbService } from '../../../../services/dashboard/tmdb.service';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilArrowLeft, cilArrowRight, cilCalendar, cilStar, cilCaretRight } from '@coreui/icons';


@Component({
  selector: 'app-trading-movies',
  imports: [
    CarouselComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    CarouselCaptionComponent,
    CarouselControlComponent,
    AsyncPipe,
    IconModule,
    DatePipe,
    DecimalPipe,
],
  templateUrl: './trading-movies.html',
  styleUrl: './trading-movies.scss',
  standalone: true,
  providers: [
    IconSetService
  ]
})
export class TradingMovies {
  private store = inject(Store);
  private tmdb = inject(TmdbService);
  public iconSet = inject(IconSetService);

  @ViewChild(CarouselComponent) carouselComponent?: CarouselComponent;
  @ViewChild('control') nextControl!: CarouselControlComponent;
  trending$ = this.store.select(selectTrending);

  slides$ = this.trending$.pipe(
    map(movies =>
      movies.map(movie => ({
        id: movie.id,
        imgSrc: this.tmdb.img(movie.poster_path, 'w342') ?? 'assets/placeholder-poster.jpg',
        backgroundImgSrc:
          this.tmdb.img(movie.backdrop_path, 'w1280') ??
          this.tmdb.img(movie.poster_path, 'w780') ??
          'assets/placeholder-backdrop.jpg',
        title: movie.title,
        overview: movie.overview,
        rating: movie.vote_average,
        rating5: Math.round((movie.vote_average / 2) * 10) / 10,
        likes: 100,
        releaseDate: movie.release_date,
      }))
    )
  );


  constructor() {
    this.store.dispatch(loadDashboard())
    this.iconSet.icons = {
      cilArrowLeft,
      cilArrowRight,
      cilCalendar,
      cilStar,
      cilCaretRight,
    };

    const sub = this.slides$.subscribe((value) => {
      if(value.length) {
        this.clickNextItem();
        sub.unsubscribe();
      }
    })
  };

  clickNextItem() {
    setTimeout(() => {
      const mockMouseEvent: MouseEvent = new MouseEvent('');
      this.nextControl.onClick(mockMouseEvent);
    }, 200);
  }
}

export interface Slide {
  id: number;
  imgSrc: string | null;
  backgroundImgSrc: string | null;
  title: string;
  overview: string;
  likes: number;
  reactions: number;
  releaseDate?: string;
  rating5: number,
  rating: number,
}
