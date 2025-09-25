import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RegionInfoService } from '../../services/region-info.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-vpn-info-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './vpn-info-banner.html',
  styleUrl: './vpn-info-banner.scss',
})
export class VpnInfoBanner {
  private regionInfoService = inject(RegionInfoService);

  showVpnInfo$ = this.regionInfoService.showVpnInfo$;

  hideBanner(): void {
    this.regionInfoService.hideVpnInfo();
  }
}
