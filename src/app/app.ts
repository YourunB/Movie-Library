import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Header } from './layouts/main-layout/header/header';
import { Footer } from './layouts/main-layout/footer/footer';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { ThemeService } from './shared/services/theme.service';
import { VpnInfoBanner } from './shared/components/vpn-info-banner/vpn-info-banner';
import { RegionInfoService } from './shared/services/region-info.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, RouterOutlet, VpnInfoBanner, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private authservice = inject(AuthService);
  private themeService = inject(ThemeService);
  private wasUser = localStorage.getItem('userUID');

  showVpnInfo$ = inject(RegionInfoService).showVpnInfo$;

  ngOnInit(): void {
    if (this.wasUser) {
      this.authservice.getCurrentAuthUser();
    }
    this.themeService.theme$.subscribe();
  }
}
