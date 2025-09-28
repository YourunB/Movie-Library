import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectLanguages } from './select-languages';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

describe('SelectLanguages', () => {
  let component: SelectLanguages;
  let fixture: ComponentFixture<SelectLanguages>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;

  beforeEach(async () => {
    languageServiceSpy = jasmine.createSpyObj<LanguageService>('LanguageService', ['changeLanguage']);

    await TestBed.configureTestingModule({
      imports: [SelectLanguages],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: TranslatePipe, useValue: { transform: (value: string) => value } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLanguages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle select status', () => {
    expect(component.isSelectLanguage).toBeFalse();
    component.changeSelectStatus();
    expect(component.isSelectLanguage).toBeTrue();
    component.changeSelectStatus();
    expect(component.isSelectLanguage).toBeFalse();
  });

  it('should change language and update state', () => {
    component.onLanguageChange('RU');
    expect(component.selectedLang).toBe('RU');
    expect(languageServiceSpy.changeLanguage).toHaveBeenCalledWith('ru');
    expect(component.isSelectLanguage).toBeFalse();
  });

  it('should initialize selectedLang from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('pl');
    const testFixture = TestBed.createComponent(SelectLanguages);
    const testInstance = testFixture.componentInstance;
    expect(testInstance.selectedLang).toBe('PL');
  });

  it('should default selectedLang to EN if localStorage is empty', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const testFixture = TestBed.createComponent(SelectLanguages);
    const testInstance = testFixture.componentInstance;
    expect(testInstance.selectedLang).toBe('EN');
  });

  it('should expose available languages', () => {
    expect(Array.isArray(component.languages)).toBeTrue();
    expect(component.languages.length).toBeGreaterThan(0);
  });
});
