import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Header } from './layouts/main-layout/header/header';
import { Footer } from './layouts/main-layout/footer/footer';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { VpnInfoBanner } from './shared/components/vpn-info-banner/vpn-info-banner';
import { RegionInfoService } from './shared/services/region-info.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './shared/services/language.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    Footer,
    RouterOutlet,
    VpnInfoBanner,
    CommonModule,
    MatProgressBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private authservice = inject(AuthService);
  private themeService = inject(ThemeService);
  private wasUser = localStorage.getItem('userUID');
  languages = ['en', 'ru', 'pl'];
  selectedLang!: string | null;
  loading = false;

  showVpnInfo$ = inject(RegionInfoService).showVpnInfo$;
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.wasUser) {
      this.authservice.getCurrentAuthUser();
    }
    this.themeService.theme$.subscribe();

    this.translate.addLangs(this.languages);
    this.translate.setFallbackLang(this.languageService.getCurrentLanguage());
    this.languageService.language$.subscribe((lang) => {
      this.switchLanguage(lang);
    });
    this.selectedLang = this.languageService.getCurrentLanguage();
    this.switchLanguage(this.selectedLang);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }

  switchLanguage(language: string) {
    this.selectedLang = language;
    this.translate.use(language);
  }
}
