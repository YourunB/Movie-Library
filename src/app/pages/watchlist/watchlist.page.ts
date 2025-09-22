import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-watchlist.page',
  imports: [],
  templateUrl: './watchlist.page.html',
  styleUrl: './watchlist.page.scss'
})
export class WatchlistPage {
  authService = inject(AuthService);
}
