// layouts/main-layout/popular-slider/popular-slider.ts
import { Component, Input, ViewChild, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  CarouselComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent
} from '@coreui/angular';
import { AsyncPipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectPopularPeople } from '../../../../store/dashboard.selectors';
import { TmdbService } from '../../../../services/dashboard/tmdb.service';
import { loadDashboard } from '../../../../store/dashboard.actions';
import { map } from 'rxjs';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { cilCaretLeft, cilCaretRight } from '@coreui/icons';

interface PersonCard {
  id: number;
  name: string;
  imgSrc: string | null;
  department?: string;
  popularity?: number;
}

@Component({
  selector: 'app-popular-slider',
  standalone: true,
  imports: [
    // coreui carousel
    CarouselComponent, CarouselInnerComponent, CarouselItemComponent, CarouselControlComponent,
    // angular
    AsyncPipe, NgForOf, NgIf, DecimalPipe,
    // coreui icons
    IconModule,
    CarouselIndicatorsComponent
],
  templateUrl: './popular-slider.html',
  styleUrl: './popular-slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [IconSetService]
})
export class PopularPeopleSlider {
  @Input() title = 'Popular People';
  @Input() itemsPerSlide = 6;
  @Input() source: 'people' | 'movies' = 'people';

  private store = inject(Store);
  private tmdb = inject(TmdbService);
  public iconSet = inject(IconSetService);


  @ViewChild(CarouselComponent) carousel?: CarouselComponent;
  @ViewChild('nextCtrl') nextCtrl!: CarouselControlComponent;

  people$ = this.store.select(selectPopularPeople);

  slides$ = this.people$.pipe(
    map(people => {
      const cards: PersonCard[] = people.map(p => ({
        id: p.id,
        name: p.name,
        imgSrc: this.tmdb.img(p.profile_path, 'w185'),
        department: p.known_for_department,
        popularity: p.popularity
      }));

      const chunked: PersonCard[][] = [];
      for (let i = 0; i < cards.length; i += this.itemsPerSlide) {
        chunked.push(cards.slice(i, i + this.itemsPerSlide));
      }
      return chunked;
    })
  );

  constructor() {
    this.store.dispatch(loadDashboard());
    this.iconSet.icons = { cilCaretLeft, cilCaretRight, };
  }

  clickNext() {
    const ev = new MouseEvent('');
    this.nextCtrl?.onClick(ev);
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByPersonId(_index: number, item: { id: number }): number {
    return item.id;
  }
}
