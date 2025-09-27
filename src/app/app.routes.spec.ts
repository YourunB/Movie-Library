import { routes } from './app.routes';
import { authGuard } from './shared/guards/auth.guard';
import { PreUserResolver } from './shared/resolvers/signinup.resolver';
import { MovieResolver } from '../store/movie/movie.resolver';

describe('App Routes', () => {
  it('should contain expected paths', () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toEqual([
      '',
      'signup',
      'signin',
      'movie/:id',
      'person/:id',
      'gallery',
      'watchlist',
      'about',
      '**',
    ]);
  });

  it('should configure resolvers correctly', () => {
    const signupRoute = routes.find((r) => r.path === 'signup');
    const signinRoute = routes.find((r) => r.path === 'signin');
    const movieRoute = routes.find((r) => r.path === 'movie/:id');

    expect(signupRoute?.resolve?.['preUserData']).toBe(PreUserResolver);
    expect(signinRoute?.resolve?.['preUserData']).toBe(PreUserResolver);
    expect(movieRoute?.resolve?.['preload']).toBe(MovieResolver);
  });

  it('should protect watchlist route with authGuard', () => {
    const watchlistRoute = routes.find((r) => r.path === 'watchlist');
    expect(watchlistRoute?.canActivate).toContain(authGuard);
  });

  it('should define fallback route', () => {
    const fallbackRoute = routes.find((r) => r.path === '**');
    expect(fallbackRoute).toBeTruthy();
    expect(fallbackRoute?.data?.['title']).toBe('notfound-page');
  });
});
