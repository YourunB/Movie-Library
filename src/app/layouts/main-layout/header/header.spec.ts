import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { toggleMenu } from '../../../../store/ui/ui.actions';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let storeSpy: jasmine.SpyObj<Store>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserObservable', 'getAuthenticatedObservable', 'resetUser']);

    storeSpy.select.and.returnValue(of(false));
    authServiceSpy.getAuthenticatedObservable.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render logo with IMDB text', () => {
    const logo = fixture.debugElement.query(By.css('.logo'));
    expect(logo.nativeElement.textContent).toContain('IMDB');
  });

  it('should dispatch toggleMenu when menu button is clicked', () => {
    const menuBtn = fixture.debugElement.query(By.css('.menu-button'));
    menuBtn.nativeElement.click();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(toggleMenu());
  });

  it('should update query and call search()', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = 'Matrix';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const searchBtn = fixture.debugElement.query(By.css('.search-section button'));
    searchBtn.nativeElement.click();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/gallery'], {
      queryParams: { q: 'Matrix', category: 'all' }
    });
  });

  it('should show user email and logout button when authenticated', () => {
    const email = fixture.debugElement.query(By.css('.user-email'));
    expect(email.nativeElement.textContent).toContain('test@example.com');

    const logoutIcon = fixture.debugElement.query(By.css('.logout-icon'));
    expect(logoutIcon).toBeTruthy();
  });

  it('should call logout() and navigate to /signin', () => {
    spyOn(component, 'logout').and.callThrough();
    const logoutIcon = fixture.debugElement.query(By.css('.logout-icon'));
    logoutIcon.nativeElement.click();

    expect(authServiceSpy.resetUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signin']);
  });
});
