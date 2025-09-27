import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { Store } from '@ngrx/store';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../shared/services/auth.service';
import { toggleMenu } from '../../../../store/ui/ui.actions';
import { of } from 'rxjs';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ThemeService } from '../../../shared/services/theme.service';

interface AppState {
  ui: unknown;
}

@Component({
  standalone: true,
  template: '',
})
class DummyComponent {}

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let component: Header;
  let storeSpy: Spy<Store<AppState>>;
  let authServiceSpy: Spy<AuthService>;

  beforeEach(() => {
    storeSpy = createSpyFromClass<Store<AppState>>(Store);
    authServiceSpy = createSpyFromClass<AuthService>(AuthService);

    authServiceSpy.getUserObservable.and.returnValue(of(null));
    authServiceSpy.getAuthenticatedObservable.and.returnValue(of(false));

    TestBed.configureTestingModule({
      imports: [
        Header,
        DummyComponent,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([
          { path: '', component: DummyComponent },
          { path: 'gallery', component: DummyComponent },
          { path: 'signin', component: DummyComponent },
        ]),
        { provide: Store, useValue: storeSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ThemeService, useValue: {} },
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
  });

  it('should not navigate when search() is called with empty query', () => {
    component.query = '   ';
    component.search();
  });

  it('should call authService.resetUser and navigate to /signin on logout()', () => {
    component.logout();
    expect(authServiceSpy.resetUser).toHaveBeenCalled();
  });
});
