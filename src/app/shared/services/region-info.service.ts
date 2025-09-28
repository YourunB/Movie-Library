import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RegionInfoService {
  private platformId: object = inject(PLATFORM_ID);
  private http = inject(HttpClient);

  private readonly STORAGE_KEY = 'vpnInfoDismissedUntil';
  private readonly DISMISS_DAYS_DEFAULT = 30;

  private readonly showSubject = new BehaviorSubject<boolean>(false);
  public readonly show$: Observable<boolean> = this.showSubject.asObservable();
  public readonly showVpnInfo$: Observable<boolean> = this.show$; 

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      this.showSubject.next(false);
      return;
    }

    const initial = this.shouldShowForBrowser();
    if (initial) {
      this.showSubject.next(true);
      return;
    }

    const dismissedUntil = localStorage.getItem(this.STORAGE_KEY);
    if (!(dismissedUntil && new Date(dismissedUntil) > new Date())) {
      this.checkGeoByIP();
    }
  }

  flagPossibleRegionBlock(): void {
    if (!this.current) this.showSubject.next(true);
  }

  get current(): boolean { return this.showSubject.value; }

  acknowledge(days = this.DISMISS_DAYS_DEFAULT): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const until = new Date();
    until.setDate(until.getDate() + days);
    localStorage.setItem(this.STORAGE_KEY, until.toISOString());
    this.showSubject.next(false);
  }

  resetDismissal(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(this.STORAGE_KEY);
    this.showSubject.next(this.shouldShowForBrowser());
    this.checkGeoByIP();
  }

  getShowVpnInfo(): boolean { return this.current; }
  hideVpnInfo(): void { this.showSubject.next(false); }


  private shouldShowForBrowser(): boolean {
    const dismissedUntil = localStorage.getItem(this.STORAGE_KEY);
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) return false;

    const userAgent = (navigator.userAgent || '').toLowerCase();
    const language = (navigator.language || '').toLowerCase();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    const ruLang = language.includes('ru') || language.includes('be');
    const ruUserAgent = userAgent.includes('ru_ru') || userAgent.includes('yabrowser');
    const ruTimezones = [
      'Europe/Moscow','Europe/Kaliningrad','Europe/Samara','Europe/Astrakhan','Europe/Ulyanovsk',
      'Europe/Volgograd','Asia/Yekaterinburg','Asia/Omsk','Asia/Novosibirsk','Asia/Barnaul',
      'Asia/Tomsk','Asia/Novokuznetsk','Asia/Krasnoyarsk','Asia/Irkutsk','Asia/Chita',
      'Asia/Yakutsk','Asia/Vladivostok','Asia/Khandyga','Asia/Sakhalin','Asia/Magadan',
      'Asia/Srednekolymsk','Asia/Kamchatka','Asia/Anadyr','Europe/Minsk'
    ];
    const ruTz = ruTimezones.some(tz => timezone.includes(tz));

    return ruLang || ruTz || ruUserAgent;
  }

  private checkGeoByIP(): void {
    this.http.get('https://ipapi.co/country/', { responseType: 'text' })
      .pipe(catchError(() => of('')))
      .subscribe(code => {
        const cc = (code || '').trim().toUpperCase();
        if (cc === 'RU' || cc === 'BY') {
          this.showSubject.next(true);
        }
      });
  }
}
