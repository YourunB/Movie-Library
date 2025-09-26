import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Menu } from './menu';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { closeMenu } from '../../../../../store/ui/ui.actions';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [{ provide: Store, useValue: storeSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render logo text', () => {
    const logo = fixture.debugElement.query(By.css('.header__logo'));
    expect(logo.nativeElement.textContent).toContain('IMDB');
  });

  it('should call close() when ✕ button is clicked', () => {
    const closeBtn = fixture.debugElement.query(By.css('.header__close'));
    closeBtn.nativeElement.click();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(closeMenu());
  });

  it('should render home and about links with routerLink', () => {
    const links = fixture.debugElement.queryAll(By.css('a[routerLink]'));
    const paths = links.map(el => el.attributes['ng-reflect-router-link']);
    expect(paths).toContain('/');
    expect(paths).toContain('/about');
  });

  it('should render popular films with correct queryParams', () => {
    const matrixLink = fixture.debugElement.query(
      By.css('a[ng-reflect-query-params*="Matrix"]')
    );
    expect(matrixLink).toBeTruthy();
    expect(matrixLink.nativeElement.textContent).toContain('menu.popular-films.matrix');
  });

  it('should dispatch closeMenu on any link click', () => {
    const allLinks = fixture.debugElement.queryAll(By.css('a'));
    allLinks.forEach(link => {
      link.nativeElement.click();
    });
    expect(storeSpy.dispatch).toHaveBeenCalledTimes(allLinks.length);
    expect(storeSpy.dispatch).toHaveBeenCalledWith(closeMenu());
  });
});
