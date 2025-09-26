import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { TranslatePipe } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        {
          provide: TranslatePipe,
          useValue: {
            transform: (key: string) => key
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render translated titles', () => {
    const titles = fixture.debugElement.queryAll(By.css('.box__title'));
    expect(titles.length).toBe(2);
    expect(titles[0].nativeElement.textContent).toContain('footer.box__title_1');
    expect(titles[1].nativeElement.textContent).toContain('footer.box__title_2');
  });

  it('should contain correct GitHub links', () => {
    const links = fixture.debugElement.queryAll(By.css('.box__link'));
    const hrefs = links.map(link => link.nativeElement.getAttribute('href'));
    expect(hrefs).toContain('https://github.com/yourunb');
    expect(hrefs).toContain('https://github.com/anastan588');
    expect(hrefs).toContain('https://github.com/RamanMilashevich');
  });

  it('should contain correct image sources and alt attributes', () => {
    const images = fixture.debugElement.queryAll(By.css('img'));
    expect(images.length).toBeGreaterThan(0);
    images.forEach(img => {
      expect(img.attributes['src']).toBeTruthy();
      expect(img.attributes['alt']).toBeTruthy();
    });
  });

  it('should display © 2025', () => {
    const year = fixture.debugElement.query(By.css('.main-info__year'));
    expect(year.nativeElement.textContent).toContain('© 2025');
  });
});
