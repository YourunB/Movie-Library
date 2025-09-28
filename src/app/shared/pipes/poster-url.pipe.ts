import { Pipe, PipeTransform, inject } from '@angular/core';
import { TmdbService } from '../services/dashboard/tmdb.service';

@Pipe({
  name: 'posterUrl',
  standalone: true,
})
export class PosterUrlPipe implements PipeTransform {
  private tmdb = inject(TmdbService);

  transform(path: string | null | undefined, size: 'w342' | 'w500' | 'original' = 'w342'): string {
    const url = path ? this.tmdb.img(path, size) : null;
    return url ?? 'images/placeholder.jpg';
  }
}


