import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const storeMock = {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select').and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage, TranslateModule.forRoot()],
      providers: [{ provide: Store, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
