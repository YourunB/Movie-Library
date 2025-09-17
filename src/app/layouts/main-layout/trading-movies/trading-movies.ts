import { Component, inject, ViewChild, WritableSignal } from '@angular/core';
import {
  CarouselCaptionComponent, CarouselComponent, CarouselControlComponent,
  CarouselInnerComponent, CarouselItemComponent
} from '@coreui/angular';
import { Store } from '@ngrx/store';
import { selectTrending } from '../../../../store/dashboard.selectors';
import { loadDashboard } from '../../../../store/dashboard.actions';
import { BehaviorSubject, combineLatest, filter, map, startWith, take } from 'rxjs';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilArrowLeft, cilArrowRight, cilCalendar, cilStar, cilCaretRight } from '@coreui/icons';
import { SideSlider } from '../side-slider/side-slider';
import { SideSlide, TmdbMovie, TmdbPerson } from '../../../../models/dashboard';

type Intent = 'none' | 'next' | 'prev' | 'side';
type Slot = 'left' | 'mid' | 'right';
function isWritableSignalNumber(v: unknown): v is WritableSignal<number> {
  return typeof v === 'function';
}
interface SideSlideView {
  key: string;
  id: number | string;
  imgSrc: string | null;
  title?: string;
  name?: string;
  releaseDate?: string;
  sourceIndex: number;
  slot: Slot;
  vmKey: string;
  rating?: number; // <-- add this
}


@Component({
  selector: 'app-trading-movies',
  standalone: true,
  imports: [
    CarouselComponent, CarouselInnerComponent, CarouselItemComponent,
    CarouselCaptionComponent, CarouselControlComponent,
    AsyncPipe, IconModule, DatePipe, DecimalPipe, SideSlider
  ],
  templateUrl: './trading-movies.html',
  styleUrl: './trading-movies.scss',
  providers: [IconSetService]
})
export class TradingMovies {
  private store = inject(Store);
  private tmdb = inject(TmdbService);
  public iconSet = inject(IconSetService);

  @ViewChild(CarouselComponent) carouselComponent?: CarouselComponent;
  @ViewChild('control') nextControl!: CarouselControlComponent;

  trending$ = this.store.select(selectTrending);
  public activeIndex$ = new BehaviorSubject<number>(0);
  private windowAnchor$ = new BehaviorSubject<number>(0);
  private intent: Intent = 'none';
  private lastActiveIndex = 0;
  private slidesCount = 0;

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
        reactions: 0,
        likes: 100,
        releaseDate: movie.release_date,
      }))
    )
  );

  sideSlides$ = combineLatest([this.slides$, this.windowAnchor$]).pipe(
    map(([slides, anchor]) => {
      const n = slides.length;
      if (!n) return [];
      const i = ((anchor % n) + n) % n;

      const mk = (idx: number, slot: Slot): SideSlideView => ({
        key: String(slides[idx].id),
        id: slides[idx].id,
        imgSrc: slides[idx].imgSrc,
        title: slides[idx].title,
        releaseDate: slides[idx].releaseDate,
        rating: slides[idx].rating,
        sourceIndex: idx,
        slot,
        vmKey: `${slides[idx].id}-${slot}`,
      });

      return [
        mk((i + 1) % n, 'left'),
        mk((i + 2) % n, 'mid'),
        mk((i + 3) % n, 'right'),
      ];
    }),
    startWith([] as SideSlideView[])
  );

  constructor() {
    this.store.dispatch(loadDashboard());
    this.iconSet.icons = { cilArrowLeft, cilArrowRight, cilCalendar, cilStar, cilCaretRight };

    this.slides$
      .pipe(
        filter(slides => slides.length > 0),
        take(1)                           
      )
      .subscribe(slides => {
        this.slidesCount = slides.length;
        this.intent = 'next';
        this.clickNextItem();
      });
  }


  private getCarouselIndex(): number {
    const val = this.carouselComponent?.activeIndex as unknown as number | WritableSignal<number> | undefined;

    if (isWritableSignalNumber(val)) {
      return val();
    }

    return val ?? 0;
  }

  clickNextItem() {
    setTimeout(() => {
      const mockMouseEvent: MouseEvent = new MouseEvent('');
      this.nextControl.onClick(mockMouseEvent);
    }, 200);
  }

  onItemChange(ev: unknown): void {
    const newIndex: number = typeof ev === 'number' ? ev : this.getCarouselIndex();

    const n = this.slidesCount || 1;
    const prev = this.lastActiveIndex;

    const movedForwardByOne = ((prev + 1) % n) === newIndex;
    const movedBackwardByOne = ((prev - 1 + n) % n) === newIndex;
    this.activeIndex$.next(newIndex);

    if (
      this.intent === 'next' ||
      (this.intent === 'none' && movedForwardByOne) ||
      this.intent === 'prev' ||
      (this.intent === 'none' && movedBackwardByOne)
    ) {
      this.windowAnchor$.next(newIndex);
    }

    this.lastActiveIndex = newIndex;
    this.intent = 'none';
  }

  onNextClick(): void { this.intent = 'next'; }
  onPrevClick(): void { this.intent = 'prev'; }

  toSideSlideFromMovie(m: TmdbMovie, idx: number): SideSlide {
    return {
      key: String(m.id),
      sourceIndex: idx,
      title: m.title || m.name || 'Untitled',
      imgSrc: this.tmdb.img(m.poster_path, 'w154'),
      releaseDate: m.release_date,
      rating: m.vote_average,
    };
  }

  toSideSlideFromPerson(p: TmdbPerson, idx: number): SideSlide {
    return {
      key: String(p.id),
      sourceIndex: idx,
      title: p.name,
      imgSrc: this.tmdb.img(p.profile_path, 'w154'),
      name: p.known_for_department,
    };
  }

  onSideSelect(index: number): void {
    this.intent = 'side';
    this.activeIndex$.next(index);
  }
}
