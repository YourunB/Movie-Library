import { ApplicationConfig } from '@angular/core';
import {
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withFetch, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { uiReducer } from '../store/ui.reducer';
import { dashboardReducer } from '../store/dashboard.reducer';
import { DashboardEffects } from '../store/dashboard.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { tmdbAuthInterceptor } from '../interceptors/tmdb-auth.interceptor';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';



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
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true
    }),
    provideEffects([DashboardEffects]),
    provideAnimations(),
    provideRouter(routes),
  ]
};
