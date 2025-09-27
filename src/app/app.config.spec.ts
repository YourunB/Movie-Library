import { appConfig } from './app.config';

describe('appConfig', () => {
  it('should be defined and have providers', () => {
    expect(appConfig).toBeDefined();
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBeTrue();
  });

  it('should include router configuration', () => {
    const hasRouter = appConfig.providers.some((provider) =>
      provider.toString().includes('ROUTES')
    );
    expect(hasRouter).toBeTrue();
  });

  it('should include HTTP client configuration', () => {
    const hasHttpClient = appConfig.providers.some((provider) =>
      provider.toString().includes('HTTP_INTERCEPTORS')
    );
    expect(hasHttpClient).toBeTrue();
  });

  it('should include NgRx store reducers', () => {
    const hasStore = appConfig.providers.some((provider) =>
      provider.toString().includes('Store')
    );
    expect(hasStore).toBeTrue();
  });

  it('should include translation service', () => {
    const hasTranslate = appConfig.providers.some((provider) =>
      provider.toString().includes('TranslateService')
    );
    expect(hasTranslate).toBeTrue();
  });
});
