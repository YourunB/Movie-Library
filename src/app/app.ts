import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Header } from './layouts/main-layout/header/header';
import { Footer } from './layouts/main-layout/footer/footer';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private authservice = inject(AuthService);
  private themeService = inject(ThemeService);
  private wasUser = localStorage.getItem('userUID');

  ngOnInit(): void {
    if (this.wasUser) {
      this.authservice.getCurrentAuthUser();
    }
    // Initialize theme service to set up theme
    this.themeService.theme$.subscribe();
  }
}
