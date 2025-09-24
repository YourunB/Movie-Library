import { ApplicationConfig } from '@angular/core';
import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { uiReducer } from '../store/ui/ui.reducer';
import { dashboardReducer } from '../store/dashboard/dashboard.reducer';
import { DashboardEffects } from '../store/dashboard/dashboard.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { tmdbAuthInterceptor } from '../interceptors/tmdb-auth.interceptor';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { watchlistReducer } from '../store/watchlist/watchlist.reducer';
import * as Sentry from '@sentry/browser';
import { provideTranslateService } from '@ngx-translate/core';
import {
  provideTranslateHttpLoader,
} from '@ngx-translate/http-loader';

Sentry.init({
  dsn: 'https://6f9f051afc78ec016604474bda76db2e@o4510075404943360.ingest.de.sentry.io/4510075406647376',
  tracesSampleRate: 1.0,
});

window.addEventListener('error', (event) => {
  Sentry.captureException(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  Sentry.captureException(event.reason);
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([tmdbAuthInterceptor])
    ),
    provideStore({
      ui: uiReducer,
      dashboard: dashboardReducer,
      watchlist: watchlistReducer,
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
    provideEffects([DashboardEffects]),
    provideAnimations(),
    provideRouter(routes),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
