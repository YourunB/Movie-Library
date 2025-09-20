import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { selectTheme } from '../../../store/ui.selectors';
import { toggleTheme, setTheme } from '../../../store/ui.actions';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private store = inject(Store);
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('dark');

  constructor() {
    this.initializeTheme();
    this.store.select(selectTheme).subscribe(theme => {
      this.themeSubject.next(theme);
      this.applyTheme(theme);
      this.saveThemeToStorage(theme);
    });
  }

  get theme$(): Observable<'light' | 'dark'> {
    return this.themeSubject.asObservable();
  }

  get currentTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    this.store.dispatch(toggleTheme());
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.store.dispatch(setTheme({ theme }));
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('movie-library-theme') as 'light' | 'dark' | null;

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('light-theme', 'dark-theme');
    htmlElement.classList.add(`${theme}-theme`);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
  }

  private saveThemeToStorage(theme: 'light' | 'dark'): void {
    localStorage.setItem('movie-library-theme', theme);
  }
}
