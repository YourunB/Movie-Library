import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TmdbService } from '../../../services/dashboard/tmdb.service';

@Component({
  selector: 'app-person-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person.page.html',
  styleUrl: './person.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonPage {
  private route = inject(ActivatedRoute);
  private tmdb = inject(TmdbService);

  private personIdRaw = toSignal<ParamMap | null>(this.route.paramMap, { initialValue: null });
  personId = computed(() => Number(this.personIdRaw()?.get('id') ?? '0'));
  person = toSignal(this.tmdb.getPersonDetails(this.personId()), { initialValue: null });
  imgUrl = computed(() => this.tmdb.img(this.person()?.profile_path, 'w342') ?? 'assets/placeholder-profile.jpg');
}


