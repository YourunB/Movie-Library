import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { TranslateModule } from '@ngx-translate/core';

describe('Footer', () => {
beforeEach(async () => {
await TestBed.configureTestingModule({
imports: [Footer, TranslateModule.forRoot()],
}).compileComponents();
});

it('should create', () => {
const fixture = TestBed.createComponent(Footer);
expect(fixture.componentInstance).toBeTruthy();
});

it('should contain two box titles', () => {
const fixture = TestBed.createComponent(Footer);
fixture.detectChanges();
const element: HTMLElement = fixture.nativeElement;
const titles = element.querySelectorAll('.box__title');
expect(titles.length).toBe(2);
});

it('should contain GitHub links', () => {
  const fixture = TestBed.createComponent(Footer);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  const links = Array.from(element.querySelectorAll('.box__link')).map(
    a => (a as HTMLAnchorElement).href
  );
  expect(links).toContain('https://github.com/yourunb');
  expect(links).toContain('https://github.com/anastan588');
  expect(links).toContain('https://github.com/RamanMilashevich');
});

it('should contain copyright 2025', () => {
const fixture = TestBed.createComponent(Footer);
fixture.detectChanges();
const element: HTMLElement = fixture.nativeElement;
const year = element.querySelector('.main-info__year')?.textContent;
expect(year).toContain('2025');
});
});