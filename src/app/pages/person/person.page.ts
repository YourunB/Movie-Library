import { Component, ChangeDetectionStrategy, inject, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../../services/dashboard/tmdb.service';
import { TmdbPerson } from '../../../models/dashboard';
import { combineLatest, switchMap } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-person-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonPage {
  @Input() title!: string;
  private route = inject(ActivatedRoute);
  private tmdb = inject(TmdbService);

  personDetails$ = combineLatest([
    toObservable(computed(() => this.personId())),
    toObservable(this.tmdb.langRequests),
  ]).pipe(switchMap(([id]) => this.tmdb.getPersonDetails(id)));

  private personIdRaw = toSignal<ParamMap | null>(this.route.paramMap, {
    initialValue: null,
  });
  personId = computed(() => Number(this.personIdRaw()?.get('id') ?? '0'));
  person = toSignal<TmdbPerson | null>(this.personDetails$, { initialValue: null });
  imgUrl = computed(
    () =>
      this.tmdb.img(this.person()?.profile_path, 'w342') ??
      'images/placeholder.jpg'
  );
}
