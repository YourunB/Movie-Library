import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { RegionInfoService } from './shared/services/region-info.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

class MockStore {
  dispatch = jasmine.createSpy();
  select = jasmine.createSpy().and.returnValue(of(null));
}

class MockRegionInfoService {
  showVpnInfo$ = of(false);
  hideVpnInfo = jasmine.createSpy();
}

class MockTranslateService {
  get = jasmine.createSpy().and.returnValue(of(''));
  use = jasmine.createSpy().and.returnValue(of(''));
  instant = jasmine.createSpy().and.returnValue('');
  onLangChange = of({ lang: 'en' });
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: RegionInfoService, useClass: MockRegionInfoService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
