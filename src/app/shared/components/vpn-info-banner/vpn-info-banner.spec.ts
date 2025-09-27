import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

import { VpnInfoBanner } from './vpn-info-banner';
import { RegionInfoService } from '../../services/region-info.service';

describe('VpnInfoBanner', () => {
  let fixture: ComponentFixture<VpnInfoBanner>;
  let component: VpnInfoBanner;
  let regionInfo: jasmine.SpyObj<RegionInfoService>;
  let visibility$: BehaviorSubject<boolean>;

  beforeEach(async () => {
    visibility$ = new BehaviorSubject<boolean>(true);

    regionInfo = jasmine.createSpyObj<RegionInfoService>(
      'RegionInfoService',
      ['hideVpnInfo'],
      { showVpnInfo$: visibility$.asObservable() }
    );

    await TestBed.configureTestingModule({
      imports: [VpnInfoBanner],
      providers: [{ provide: RegionInfoService, useValue: regionInfo }],
    })
      .overrideComponent(VpnInfoBanner, {
        set: {
          imports: [CommonModule],
          template: `
            <div class="vpn-banner" *ngIf="(showVpnInfo$ | async)">
              <button class="close-button" (click)="hideBanner()">x</button>
            </div>
          `,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(VpnInfoBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function queryBanner(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.vpn-banner');
  }
  function queryCloseBtn(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.close-button');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders banner when showVpnInfo$ emits true', () => {
    visibility$.next(true);
    fixture.detectChanges();

    expect(queryBanner()).toBeTruthy();
  });

  it('hides banner when showVpnInfo$ emits false', () => {
    visibility$.next(false);
    fixture.detectChanges();

    expect(queryBanner()).toBeFalsy();
  });

  it('clicking close calls RegionInfoService.hideVpnInfo()', () => {
    visibility$.next(true);
    fixture.detectChanges();

    const btn = queryCloseBtn();
    expect(btn).toBeTruthy();

    btn!.click();
    expect(regionInfo.hideVpnInfo).toHaveBeenCalled();
  });
});
