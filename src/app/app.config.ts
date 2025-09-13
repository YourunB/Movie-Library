import { ApplicationConfig } from '@angular/core';
import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; 

import { uiReducer } from '../store/ui.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    provideStore({
      ui: uiReducer,
    }),
    provideEffects([]),
    provideRouter(routes),
  ]
};
