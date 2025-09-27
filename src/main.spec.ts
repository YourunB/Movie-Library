import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

describe('bootstrapApplication', () => {
  beforeEach(() => {
    const root = document.createElement('app-root');
    document.body.appendChild(root);
  });

  afterEach(() => {
    const root = document.querySelector('app-root');
    if (root) {
      document.body.removeChild(root);
    }
  });

  it('should bootstrap App without throwing', async () => {
    await expectAsync(bootstrapApplication(App, appConfig)).toBeResolved();
  });
});
