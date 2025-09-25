// layouts/main-layout/popular-slider/popular-slider.ts
import { Component, ChangeDetectionStrategy, inject, input, viewChild, computed, effect } from '@angular/core';
import {
  CarouselComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  CarouselControlComponent,
} from '@coreui/angular';
import { AsyncPipe, CommonModule, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectPopularPeople } from '../../../../store/dashboard/dashboard.selectors';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { map, startWith } from 'rxjs';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilCaretLeft, cilCaretRight } from '@coreui/icons';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslatePipe } from '@ngx-translate/core';
import { toSignal } from '@angular/core/rxjs-interop';
export interface PersonCard {
  id: number;
  name: string;
  imgSrc: string | null;
  department?: string;
  popularity?: number;
}

type PersonLinkService =
  | 'wikipediaPL'
  | 'wikipediaEN'
  | 'imdb'
  | 'filmweb'
  | 'google'
  | 'youtube'
  | 'bing'
  | 'tmdb';

@Component({
  selector: 'app-popular-slider',
  standalone: true,
  imports: [
    CarouselComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    CarouselControlComponent,
    AsyncPipe,
    NgForOf,
    NgIf,
    DecimalPipe,
    IconModule,
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './popular-slider.html',
  styleUrl: './popular-slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [IconSetService],
})
export class PopularPeopleSlider {
  title = input('Popular People');
  itemsPerSlide = input(6);
  source = input<'people' | 'movies'>('people');

  private store = inject(Store);
  private tmdb = inject(TmdbService);
  public iconSet = inject(IconSetService);
  private breakpoint = inject(BreakpointObserver);
  wikiBase = 'https://pl.wikipedia.org/wiki/';

  carousel = viewChild(CarouselComponent);
  nextCtrl = viewChild<CarouselControlComponent>('nextCtrl');

  people = toSignal(this.store.select(selectPopularPeople), { initialValue: [] });

  private itemsPerSlide$ = this.breakpoint
    .observe([
      '(max-width: 400px)',
      '(max-width: 576px)',
      '(max-width: 800px)',
      '(max-width: 1000px)',
      '(max-width: 1200px)',
    ])
    .pipe(
      map((result) => {
        if (result.breakpoints['(max-width: 400px)']) return 1;
        if (result.breakpoints['(max-width: 576px)']) return 2;
        if (result.breakpoints['(max-width: 800px)']) return 3;
        if (result.breakpoints['(max-width: 1000px)']) return 4;
        if (result.breakpoints['(max-width: 1200px)']) return 5;
        return 6;
      }),
      startWith(6) // default before first match
    );
  itemsPerSlideSig = toSignal(this.itemsPerSlide$, { initialValue: 6 });

  slides = computed<PersonCard[][]>(() => {
    const people = this.people();
    const itemsPerSlide = this.itemsPerSlideSig();
    const cards: PersonCard[] = people.map((p) => ({
      id: p.id,
      name: p.name,
      imgSrc: this.tmdb.img(p.profile_path, 'w185'),
      department: p.known_for_department,
      popularity: p.popularity,
    }));

    const chunked: PersonCard[][] = [];
    for (let i = 0; i < cards.length; i += itemsPerSlide) {
      chunked.push(cards.slice(i, i + itemsPerSlide));
    }
    return chunked;
  });

  constructor() {
    this.iconSet.icons = { cilCaretLeft, cilCaretRight };

    // Autoplay effect with cleanup: advances the carousel periodically
    effect((onCleanupFn) => {
      // re-establish interval when slides change (e.g., after resize or data load)
      this.slides();
      const timer = setInterval(() => this.clickNext(), 8000);
      onCleanupFn(() => clearInterval(timer));
    });
  }

  clickNext() {
    const ev = new MouseEvent('');
    this.nextCtrl()?.onClick(ev);
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByPersonId(_index: number, item: { id: number }): number {
    return item.id;
  }

  getPersonLink(
    p: { id?: number; name?: string },
    service: PersonLinkService = 'wikipediaPL'
  ): string {
    const name = (p?.name ?? '').trim();
    if (!name) return '#';

    const q = encodeURIComponent(name);
    const normalized = encodeURIComponent(name.replace(/\s+/g, '_'));

    switch (service) {
      case 'wikipediaPL':
        return `https://pl.wikipedia.org/wiki/${normalized}`;
      case 'wikipediaEN':
        return `https://en.wikipedia.org/wiki/${normalized}`;
      case 'imdb':
        return `https://www.imdb.com/find/?s=nm&q=${q}`;
      case 'filmweb':
        return `https://www.filmweb.pl/search?q=${q}`;
      case 'google':
        return `https://www.google.com/search?q=${q}+aktor`;
      case 'youtube':
        return `https://www.youtube.com/results?search_query=${q}`;
      case 'bing':
        return `https://www.bing.com/search?q=${q}+actor`;
      case 'tmdb':
        return p?.id != null
          ? `https://www.themoviedb.org/person/${p.id}`
          : `https://www.themoviedb.org/search?query=${q}`;
      default:
        return `https://pl.wikipedia.org/wiki/${normalized}`;
    }
  }
}
