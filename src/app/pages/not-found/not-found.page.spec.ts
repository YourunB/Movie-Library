import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundPage } from './not-found.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NotFoundPage', () => {
  let fixture: ComponentFixture<NotFoundPage>;
  let component: NotFoundPage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NotFoundPage,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ],
    });

    fixture = TestBed.createComponent(NotFoundPage);
    component = fixture.componentInstance;
    component.title = 'notfound.title';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose title input', () => {
    expect(component.title).toBe('notfound.title');
  });

  it('should render translated paragraph and home icon link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toBe('notfound-page');
    expect(compiled.querySelector('.notfound-icon')?.textContent).toBe('home');

    const linkElement = fixture.debugElement.query(By.css('.notfound-link'));
    expect(linkElement).toBeTruthy();
  });
});
