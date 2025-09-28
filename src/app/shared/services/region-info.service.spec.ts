import { TestBed } from '@angular/core/testing';
import { RegionInfoService } from './region-info.service';
import { PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('RegionInfoService (browser)', () => {
  let service: RegionInfoService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  const mockPlatformId = 'browser';

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    const localStorageMock: Record<string, string | null> = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string): string | null => localStorageMock[key] ?? null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      localStorageMock[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete localStorageMock[key];
    });

    const mockNavigator: Navigator = {
      ...window.navigator,
      userAgent: 'Mozilla/5.0 yabrowser',
      language: 'ru-RU',
    };

    spyOnProperty(window, 'navigator', 'get').and.returnValue(mockNavigator);

    spyOn(Intl, 'DateTimeFormat').and.returnValue({
      resolvedOptions: () => ({ timeZone: 'Europe/Moscow' }),
    } as Intl.DateTimeFormat);

    httpSpy.get.and.returnValue(of('RU'));

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: mockPlatformId },
        { provide: HttpClient, useValue: httpSpy },
      ],
    });

    service = TestBed.inject(RegionInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show VPN info on Russian signals', () => {
    expect(service.getShowVpnInfo()).toBeTrue();
  });

  it('should hide VPN info after acknowledge', () => {
    service.acknowledge(1);
    expect(service.getShowVpnInfo()).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should reset dismissal and recheck geo', () => {
    service.resetDismissal();
    expect(localStorage.removeItem).toHaveBeenCalledWith('vpnInfoDismissedUntil');
    expect(httpSpy.get).toHaveBeenCalledWith(
      'https://ipapi.co/country/',
      jasmine.objectContaining({ responseType: 'text' })
    );
  });  

  it('should hide VPN info explicitly', () => {
    service.hideVpnInfo();
    expect(service.getShowVpnInfo()).toBeFalse();
  });

  it('should flag region block if not already shown', () => {
    service.hideVpnInfo();
    service.flagPossibleRegionBlock();
    expect(service.getShowVpnInfo()).toBeTrue();
  });
});
