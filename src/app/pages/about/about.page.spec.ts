import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutPage } from './about.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LanguageService } from '../../shared/services/language.service';
import { BehaviorSubject } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('AboutPage', () => {
  let fixture: ComponentFixture<AboutPage>;
  let component: AboutPage;

  beforeEach(() => {
    const languageServiceStub: Partial<LanguageService> = {
      language$: new BehaviorSubject<string>('en'),
    };

    TestBed.configureTestingModule({
      imports: [
        AboutPage,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: LanguageService, useValue: languageServiceStub },
        provideAnimations(),
      ],
    });

    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have creationDate set to "2025"', () => {
    expect(component.creationDate).toBe('2025');
  });

  it('should render developer cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.dev-cards__card');
    expect(cards.length).toBe(component.developers.length);
  });
});
