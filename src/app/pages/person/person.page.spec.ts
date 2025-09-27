// person.page.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { PersonPage } from './person.page';
import { TmdbService } from '../../../services/dashboard/tmdb.service';
import { signal, WritableSignal } from '@angular/core';
import { TmdbPerson } from '../../../models/dashboard';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';


class MockActivatedRoute {
  private subject: BehaviorSubject<ParamMap>;
  paramMap: BehaviorSubject<ParamMap>;

  constructor(initial: Record<string, string> = {}) {
    this.subject = new BehaviorSubject<ParamMap>(convertToParamMap(initial));
    this.paramMap = this.subject;
  }

  setParamMap(map: Record<string, string>): void {
    this.subject.next(convertToParamMap(map));
  }
}

class MockTmdbService {
  langRequests: WritableSignal<number> = signal(0);

  private static mockImg(path: string | null | undefined, size: string): string | null {
    return path ? `//image.tmdb.org/t/p/${size}${path.startsWith('/') ? '' : '/'}${path}` : null;
  }

  img = jasmine
    .createSpy<(path: string | null | undefined, size: string) => string | null>('img')
    .and.callFake(MockTmdbService.mockImg);

  private static mockPerson(id: number): TmdbPerson {
    return {
      id,
      name: 'Keanu Reeves',
      profile_path: '/abc.jpg',
      known_for_department: 'Acting',
      place_of_birth: 'Beirut, Lebanon',
      biography: 'An actor known for many films.',
    } as TmdbPerson;
  }

  getPersonDetails = jasmine
    .createSpy<(id: number) => Observable<TmdbPerson>>('getPersonDetails')
    .and.callFake((id: number) => of(MockTmdbService.mockPerson(id)));
}
@Pipe({ name: 'translate', standalone: true })
class DummyTranslatePipe implements PipeTransform {
  transform(value: unknown): string {
    return String(value ?? '');
  }
}


describe('PersonPage', () => {
  let fixture: ComponentFixture<PersonPage>;
  let component: PersonPage;
  let route: MockActivatedRoute;
  let tmdb: MockTmdbService;

  beforeEach(async () => {
    route = new MockActivatedRoute({ id: '123' });

    await TestBed.configureTestingModule({
      imports: [PersonPage],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: TmdbService, useClass: MockTmdbService },
      ],
    })
      // Replace real TranslatePipe with a simple dummy pipe
      .overrideComponent(PersonPage, {
        set: {
          imports: [CommonModule, DummyTranslatePipe],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PersonPage);
    component = fixture.componentInstance;
    component.title = 'person.title';
    tmdb = TestBed.inject(TmdbService) as unknown as MockTmdbService;
  });

  function detectAll(): void {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
  }

  it('should create', fakeAsync(() => {
    detectAll();
    expect(component).toBeTruthy();
  }));

  it('should call getPersonDetails with the id from the route (not just initial 0)', fakeAsync(() => {
    detectAll();
    expect(tmdb.getPersonDetails).toHaveBeenCalled();
    const lastArgs = tmdb.getPersonDetails.calls.mostRecent().args;
    expect(lastArgs[0]).toBe(123);
  }));

  it('should render person details (name, optional fields, bio, and image alt/src)', fakeAsync(() => {
    detectAll();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    const nameEl = fixture.nativeElement.querySelector('.meta h1') as HTMLElement;
    const deptEl = fixture.nativeElement.querySelector('.meta p:nth-of-type(1)') as HTMLElement;
    const pobEl = fixture.nativeElement.querySelector('.meta p:nth-of-type(2)') as HTMLElement;
    const bioEl = fixture.nativeElement.querySelector('.bio') as HTMLElement;

    expect(nameEl?.textContent?.trim()).toBe('Keanu Reeves');
    expect(deptEl?.textContent?.trim()).toBe('Acting');
    expect(pobEl?.textContent?.trim()).toBe('Beirut, Lebanon');
    expect(bioEl?.textContent?.trim()).toBe('An actor known for many films.');

    expect(img).toBeTruthy();
    expect(img.alt).toBe('Keanu Reeves');
    expect(img.src).toContain('/w342');
    expect(tmdb.img).toHaveBeenCalledWith('/abc.jpg', 'w342');
  }));

  it('should refetch details when language signal changes (langRequests)', fakeAsync(() => {
    detectAll();
    const initialCalls = tmdb.getPersonDetails.calls.count();

    tmdb.langRequests.set(tmdb.langRequests() + 1);
    detectAll();

    expect(tmdb.getPersonDetails.calls.count()).toBeGreaterThan(initialCalls);
    const lastId = tmdb.getPersonDetails.calls.mostRecent().args[0];
    expect(lastId).toBe(123);
  }));

  it('should update when route id changes', fakeAsync(() => {
    detectAll();
    route.setParamMap({ id: '999' });
    detectAll();

    const lastId = tmdb.getPersonDetails.calls.mostRecent().args[0];
    expect(lastId).toBe(999);
  }));

  it('should use placeholder image when tmdb.img returns null or profile_path is missing', fakeAsync(() => {
    (tmdb.img as jasmine.Spy).and.callFake(() => null);

    (tmdb.getPersonDetails as jasmine.Spy).and.returnValue(
      of({
        id: 123,
        name: 'No Photo',
        profile_path: null,
        biography: 'Bio',
      } as TmdbPerson)
    );

    tmdb.langRequests.set(tmdb.langRequests() + 1);
    detectAll();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.src).toContain('images/placeholder.jpg');
  }));

  it('should hide optional fields when they are not provided', fakeAsync(() => {
    (tmdb.getPersonDetails as jasmine.Spy).and.returnValue(
      of({
        id: 123,
        name: 'Minimal Person',
        profile_path: '/x.jpg',
        biography: 'Short bio',
        known_for_department: null as unknown as string,
        place_of_birth: null as unknown as string,
      } as TmdbPerson)
    );

    route.setParamMap({ id: '124' });
    detectAll();

    const metaParas = fixture.nativeElement.querySelectorAll('.meta p');
    expect(metaParas.length).toBe(0);

    const bioEl = fixture.nativeElement.querySelector('.bio') as HTMLElement;
    expect(bioEl?.textContent?.trim()).toBe('Short bio');
  }));
});
