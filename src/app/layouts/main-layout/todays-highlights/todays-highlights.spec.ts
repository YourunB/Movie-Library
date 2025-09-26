import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { TodaysHighlights } from './todays-highlights';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';

describe('TodaysHighlights', () => {
  let fixture: ComponentFixture<TodaysHighlights>;
  let routerNavigateSpy: jasmine.Spy;
  let dialogOpenSpy: jasmine.Spy;

  const tmdbMock = {
    langRequests: signal<string>('en-US'),
    getNowPlayingMovies: jasmine
      .createSpy('getNowPlayingMovies')
      .and.returnValue(
        of({
          page: 1,
          total_pages: 1,
          total_results: 2,
          results: [
            { id: 101, title: 'Movie A', overview: 'Overview A' },
            { id: 202, title: 'Movie B', overview: 'Overview B' },
          ],
        })
      ),
    getMovieVideos: jasmine
      .createSpy('getMovieVideos')
      .and.callFake((id: number) =>
        of({
          id,
          results: [
            { key: 'yt-key-' + id, site: 'YouTube', type: 'Trailer', name: 'Trailer' },
          ],
        })
      ),
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  } as unknown as Router;

  const dialogMock = {
    open: jasmine.createSpy('open'),
  } as unknown as MatDialog;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TodaysHighlights,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: { getTranslation: () => of({}) },
          },
        }),
      ],
      providers: [
        { provide: TmdbService, useValue: tmdbMock },
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');

    fixture = TestBed.createComponent(TodaysHighlights);
    routerNavigateSpy = (routerMock.navigate as unknown as jasmine.Spy);
    dialogOpenSpy = (dialogMock.open as unknown as jasmine.Spy);
  });

  beforeEach(() => {
    routerNavigateSpy?.calls?.reset?.();
    dialogOpenSpy?.calls?.reset?.();
  });

  it('should create', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render highlight cards with titles and overviews', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.news-card'));
    expect(cards.length).toBe(2);
    expect(cards[0].query(By.css('.title')).nativeElement.textContent).toContain('Movie A');
    expect(cards[0].query(By.css('.overview')).nativeElement.textContent).toContain('Overview A');
    expect(cards[1].query(By.css('.title')).nativeElement.textContent).toContain('Movie B');
  });

  it('should navigate to movie page on card click', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const firstCard = fixture.debugElement.queryAll(By.css('.news-card'))[0];
    firstCard.triggerEventHandler('click', new Event('click'));
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/movie', 101]);
  });

  it('should open trailer modal when trailer button clicked without navigating', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const trailerBtn = fixture.debugElement.query(By.css('button[mat-button]'));
    const clickEvent = { stopPropagation: jasmine.createSpy('stopPropagation') } as unknown as Event;
    trailerBtn.triggerEventHandler('click', clickEvent);

    expect(dialogOpenSpy).toHaveBeenCalled();
    const args = (dialogOpenSpy.calls.mostRecent().args || []);
    expect(args[1]?.width).toBe('90vw');
    expect((clickEvent as unknown as { stopPropagation: jasmine.Spy }).stopPropagation).toHaveBeenCalled();
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });
});
