import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Menu } from './menu';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { closeMenu } from '../../../../../store/ui/ui.actions';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { TranslateModule } from '@ngx-translate/core';

interface AppState {
  ui: unknown;
}

describe('Menu', () => {
  let fixture: ComponentFixture<Menu>;
  let component: Menu;
  let storeSpy: Spy<Store<AppState>>;

  beforeEach(() => {
    storeSpy = createSpyFromClass<Store<AppState>>(Store);

    TestBed.configureTestingModule({
      imports: [
        Menu,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        { provide: Store, useValue: storeSpy },
      ],
    });

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch closeMenu when close() is called', () => {
    component.close();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(closeMenu());
  });
});
