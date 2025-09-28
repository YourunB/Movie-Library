import { Injectable } from '@angular/core';
import { Languages } from '../../../models/dashboard';
import { BehaviorSubject, Observable } from 'rxjs';

export const languages: Languages[] = [
  {
    shortValue: 'EN',
    fullValue: {
      en: 'English',
      pl: 'Angielski',
      ru: 'Английский',
    },
    requestValue: 'en-US',
    image: `./icons/en.svg`,
  },
  {
    shortValue: 'RU',
    fullValue: {
      en: 'Russian',
      pl: 'Rosyjski',
      ru: 'Русский',
    },
    requestValue: 'ru-RU',
    image: `./icons/ru.svg`,
  },
  {
    shortValue: 'PL',
    fullValue: {
      en: 'Polish',
      pl: 'Polski',
      ru: 'Польский',
    },
    requestValue: 'pl-PL',
    image: `./icons/pl.svg`,
  },
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly defaultLanguage = 'en';
  private languageSubject!: BehaviorSubject<string>;

  constructor() {
    const savedLang = localStorage.getItem('language') || this.defaultLanguage;
    this.languageSubject = new BehaviorSubject<string>(savedLang);
  }

  get language$(): Observable<string> {
    return this.languageSubject.asObservable();
  }

  changeLanguage(language: string) {
    this.languageSubject.next(language);
    localStorage.setItem('language', language);
  }

  getCurrentLanguage(): string {
    return this.languageSubject.value;
  }
}
