import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { take } from 'rxjs/operators';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'language') return null;
      return null;
    });
    spyOn(localStorage, 'setItem');
    TestBed.configureTestingModule({
      providers: [LanguageService],
    });
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    (localStorage.getItem as jasmine.Spy).calls.reset();
    (localStorage.setItem as jasmine.Spy).calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language if none is saved', () => {
    expect(service.getCurrentLanguage()).toBe('en');
  });

  it('should initialize with saved language from localStorage', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue('ru');
    const newService = new LanguageService();
    expect(newService.getCurrentLanguage()).toBe('ru');
  });

  it('should emit language changes via language$', (done) => {
    service.language$.pipe(take(1)).subscribe((lang) => {
      expect(lang).toBe('en');
      done();
    });
  });

  it('should update language and persist to localStorage', () => {
    service.changeLanguage('pl');
    expect(service.getCurrentLanguage()).toBe('pl');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'pl');
  });

  it('should emit updated language after change', (done) => {
    service.changeLanguage('ru');
    service.language$.pipe(take(1)).subscribe((lang) => {
      expect(lang).toBe('ru');
      done();
    });
  });
});
