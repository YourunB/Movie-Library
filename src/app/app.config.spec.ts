import { ROUTES } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

const mockAppConfig = {
  providers: [
    { provide: ROUTES },
    { provide: HTTP_INTERCEPTORS },
    { provide: Store },
    { provide: TranslateService },
  ],
};

describe('mockAppConfig', () => {
  it('should include router configuration', () => {
    const hasRoutes = mockAppConfig.providers.some(p => p.provide === ROUTES);
    expect(hasRoutes).toBeTrue();
  });

  it('should include HTTP interceptors', () => {
    const hasHttp = mockAppConfig.providers.some(p => p.provide === HTTP_INTERCEPTORS);
    expect(hasHttp).toBeTrue();
  });

  it('should include NgRx store', () => {
    const hasStore = mockAppConfig.providers.some(p => p.provide === Store);
    expect(hasStore).toBeTrue();
  });

  it('should include TranslateService', () => {
    const hasTranslate = mockAppConfig.providers.some(p => p.provide === TranslateService);
    expect(hasTranslate).toBeTrue();
  });
});
