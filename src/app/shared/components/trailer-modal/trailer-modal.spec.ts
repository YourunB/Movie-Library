// trailer-modal.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TrailerModal, TrailerModalData } from './trailer-modal';
import { TmdbService } from '../../services/dashboard/tmdb.service';

interface ServiceResp {
  title: string;
  overview: string;
  tagline: string | undefined;
  trailer: { key: string; name: string; publishedAt: string | undefined } | undefined;
}

describe('TrailerModal', () => {
  let fixture: ComponentFixture<TrailerModal>;
  let component: TrailerModal;
  let tmdb: jasmine.SpyObj<TmdbService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TrailerModal>>;
  let sanitizer: DomSanitizer;

  const dialogDataRef: TrailerModalData = { movieTitle: 'Inception', movieId: 1 };

  beforeEach(async () => {
    const tmdbSpy = jasmine.createSpyObj<TmdbService>('TmdbService', ['getTrailerWithOverview']);
    const dialogRefSpy = jasmine.createSpyObj<MatDialogRef<TrailerModal>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TrailerModal, NoopAnimationsModule],
      providers: [
        { provide: TmdbService, useValue: tmdbSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataRef },
      ],
    })
      .overrideComponent(TrailerModal, {
        set: {
          imports: [],
          template: '<div></div>',
        },
      })
      .compileComponents();

    tmdb = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<TrailerModal>>;
    sanitizer = TestBed.inject(DomSanitizer);
  });

  function mount(opts?: {
    response?: ServiceResp;
    error?: boolean;
    data?: TrailerModalData;
  }): void {
    const data = opts?.data ?? { movieTitle: 'Inception', movieId: 1 };
    dialogDataRef.movieTitle = data.movieTitle;
    dialogDataRef.movieId = data.movieId;
    if (opts?.error) {
      tmdb.getTrailerWithOverview.and.returnValue(throwError(() => new Error('boom')));
    } else if (opts?.response) {
      tmdb.getTrailerWithOverview.and.returnValue(of(opts.response));
    } else {
      tmdb.getTrailerWithOverview.and.returnValue(
        of({
          title: dialogDataRef.movieTitle,
          overview: '',
          tagline: undefined,
          trailer: undefined,
        })
      );
    }

    fixture = TestBed.createComponent(TrailerModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick(); 
    fixture.detectChanges();
  }

  it('should create', fakeAsync(() => {
    mount({
      response: {
        title: 'Inception',
        overview: 'Some overview',
        tagline: undefined,
        trailer: undefined,
      },
    });
    expect(component).toBeTruthy();
  }));

  it('shows error when movieId is missing', fakeAsync(() => {
    mount({ data: { movieTitle: 'Inception' } }); // no movieId
    expect(tmdb.getTrailerWithOverview).not.toHaveBeenCalled();
    expect(component.error).toBe('Movie ID not provided');
    expect(component.loading).toBeFalse();
  }));

  it('toggleDesc toggles description expansion flag', fakeAsync(() => {
    mount({
      response: {
        title: 'Inception',
        overview: 'Some overview',
        tagline: undefined,
        trailer: undefined,
      },
    });
    expect(component.descExpanded).toBeFalse();
    component.toggleDesc();
    expect(component.descExpanded).toBeTrue();
    component.toggleDesc();
    expect(component.descExpanded).toBeFalse();
  }));

  it('openInYouTube falls back to YouTube search when no videoKey', fakeAsync(() => {
    mount({
      response: {
        title: 'Inception',
        overview: 'Some overview',
        tagline: undefined,
        trailer: undefined,
      },
    });
    const openSpy = spyOn(window, 'open');
    component.openInYouTube();
    expect(openSpy).toHaveBeenCalledOnceWith(
      'https://www.youtube.com/results?search_query=Inception%20trailer',
      '_blank'
    );
  }));

  it('openInYouTube opens direct video when videoKey exists', fakeAsync(() => {
    mount({
      response: {
        title: 'Inception',
        overview: 'Some overview',
        tagline: undefined,
        trailer: { key: 'abc123', name: 'Official Trailer', publishedAt: '2010-05-10' },
      },
    });
    const openSpy = spyOn(window, 'open');
    component.openInYouTube();
    expect(openSpy).toHaveBeenCalledOnceWith('https://www.youtube.com/watch?v=abc123', '_blank');
  }));

  it('shows error when API call fails', fakeAsync(() => {
    mount({ error: true, data: { movieTitle: 'Inception', movieId: 1 } });
    expect(component.error).toBe('Failed to load trailer');
    expect(component.loading).toBeFalse();
    expect(component.safeUrl).toBeNull();
  }));

  it('sets overview/tagline and shows “no trailer” message when trailer key is missing', fakeAsync(() => {
    mount({
      response: {
        title: 'Inception',
        overview: 'Some overview',
        tagline: 'Some tagline',
        trailer: undefined,
      },
    });
    expect(component.movieOverview).toBe('Some overview');
    expect(component.movieTagline).toBe('Some tagline');
    expect(component.error).toBe('No trailer found for this movie');
    expect(component.safeUrl).toBeNull();
  }));

  it('loads trailer on init and builds a safe embed URL', fakeAsync(() => {
    const sanSpy = spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();

    mount({
      response: {
        title: 'Inception',
        overview: 'Mind-bending thriller.',
        tagline: 'Your mind is the scene of the crime.',
        trailer: { key: 'abc123', name: 'Official Trailer', publishedAt: '2010-05-10' },
      },
    });

    expect(component.error).toBeNull();
    expect(component.videoKey).toBe('abc123');
    expect(component.videoName).toBe('Official Trailer');
    expect(component.publishedAt).toBe('2010-05-10');
    expect(component.movieOverview).toBe('Mind-bending thriller.');
    expect(component.movieTagline).toBe('Your mind is the scene of the crime.');
    expect(component.safeUrl).toBeTruthy();

    expect(sanSpy).toHaveBeenCalled();
    const calledWith = sanSpy.calls.mostRecent().args[0] as string;
    expect(calledWith).toBe(
      'https://www.youtube.com/embed/abc123?autoplay=1&rel=0&modestbranding=1&playsinline=1'
    );
  }));

  it('closeModal calls MatDialogRef.close()', fakeAsync(() => {
    mount({
      response: {
        title: 'Inception',
        overview: 'Some overview',
        tagline: undefined,
        trailer: undefined,
      },
    });
    component.closeModal();
    expect(dialogRef.close).toHaveBeenCalled();
  }));
});
