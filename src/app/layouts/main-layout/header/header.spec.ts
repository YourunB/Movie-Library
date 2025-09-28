import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../shared/services/auth.service';
import { ThemeService } from '../../../shared/services/theme.service';
import { WatchlistSignalsStore } from '../../../shared/services/watchlist-signals.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { toggleMenu } from '../../../../store/ui/ui.actions';
import { emptyListOfMovies } from '../../../../store/watchlist/watchlist.actions';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let component: Header;
  let storeSpy: Spy<Store<unknown>>;
  let authServiceSpy: Spy<AuthService>;
  let routerSpy: Spy<Router>;

  beforeEach(() => {
    storeSpy = createSpyFromClass(Store);
    authServiceSpy = createSpyFromClass(AuthService);
    routerSpy = createSpyFromClass(Router);

    authServiceSpy.getUserObservable.and.returnValue(of(null));
    authServiceSpy.getAuthenticatedObservable.and.returnValue(of(false));
    routerSpy.navigate.and.stub();

    TestBed.configureTestingModule({
      imports: [
        Header,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: {} },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: WatchlistSignalsStore, useValue: { favorites: () => [] } },
      ],
    });

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch toggleMenu when toggleMenu() is called', () => {
    component.toggleMenu();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(toggleMenu());
  });

  it('should navigate to gallery when search() is called with query', () => {
    component.query = 'Matrix';
    component.search();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/gallery'], {
      queryParams: { q: 'Matrix', category: 'all' },
    });
  });

  it('should not navigate when search() is called with empty query', () => {
    component.query = '   ';
    component.search();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should call authService.resetUser and navigate to /signin on logout()', () => {
    component.logout();
    expect(authServiceSpy.resetUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signin']);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(emptyListOfMovies());
  });
});
