import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-watchlist.page',
  imports: [CommonModule, MatIcon, RouterLink],
  templateUrl: './watchlist.page.html',
  styleUrl: './watchlist.page.scss'
})
export class WatchlistPage {
  authService = inject(AuthService);
}
