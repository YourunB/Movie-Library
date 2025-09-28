// side-slider.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SideSlider } from './side-slider';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({ name: 'translate', standalone: true })
class FakeTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value; 
  }
}

describe('SideSlider', () => {
  let component: SideSlider;
  let fixture: ComponentFixture<SideSlider>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockSlides = [
    {
      key: '1',
      id: 1,
      imgSrc: '/test1.jpg',
      title: 'Test Movie 1',
      name: 'Test Name 1',
      releaseDate: '2023-01-01',
      sourceIndex: 0,
      slot: 'left' as const,
      vmKey: '1-left',
      rating: 8.5
    },
    {
      key: '2',
      id: 2,
      imgSrc: '/test2.jpg',
      title: 'Test Movie 2',
      name: 'Test Name 2',
      releaseDate: '2023-02-01',
      sourceIndex: 1,
      slot: 'mid' as const,
      vmKey: '2-mid',
      rating: 7.2
    }
  ];

  function noopScrollIntoView(): void {
    return undefined;
  }

  beforeAll(() => {
    if (!('scrollIntoView' in Element.prototype)) {
      Object.defineProperty(Element.prototype, 'scrollIntoView', {
        value: noopScrollIntoView,
        configurable: true
      });
    }
  });

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SideSlider, FakeTranslatePipe],
      providers: [{ provide: Router, useValue: routerSpy }]
    })
      .overrideComponent(SideSlider, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [FakeTranslatePipe] }
      })
      .compileComponents();

    fixture = TestBed.createComponent(SideSlider);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Provide inputs before first detectChanges
    fixture.componentRef.setInput('slides', mockSlides);
    fixture.componentRef.setInput('activeIndex', 0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with inputs', () => {
    expect(component.slides()).toEqual(mockSlides);
    expect(component.activeIndex()).toBe(0);
  });

  it('should track by vmKey correctly', () => {
    const slide = mockSlides[0];
    const result = component.trackByVmKey(0, slide);
    expect(result).toBe('1-left');
  });

  it('should get label from title when available', () => {
    const slide = mockSlides[0];
    expect(component.getLabel(slide)).toBe('Test Movie 1');
  });

  it('should get label from name when title is not available', () => {
    const slide = { ...mockSlides[0], title: undefined };
    expect(component.getLabel(slide)).toBe('Test Name 1');
  });

  it('should return empty string when neither title nor name is available', () => {
    const slide = { ...mockSlides[0], title: undefined, name: undefined };
    expect(component.getLabel(slide)).toBe('');
  });

  it('should emit playTrailer with title+id (number id)', () => {
    spyOn(component.playTrailer, 'emit');
    component.onPlay(mockSlides[0]);
    expect(component.playTrailer.emit).toHaveBeenCalledWith({
      title: 'Test Movie 1',
      id: 1
    });
  });

  it('should emit playTrailer with name when title missing', () => {
    spyOn(component.playTrailer, 'emit');
    const slide = { ...mockSlides[0], title: undefined };
    component.onPlay(slide);
    expect(component.playTrailer.emit).toHaveBeenCalledWith({
      title: 'Test Name 1',
      id: 1
    });
  });

  it('should emit playTrailer with "Untitled" when both title and name missing', () => {
    spyOn(component.playTrailer, 'emit');
    const slide = { ...mockSlides[0], title: undefined, name: undefined };
    component.onPlay(slide);
    expect(component.playTrailer.emit).toHaveBeenCalledWith({
      title: 'Untitled',
      id: 1
    });
  });

  it('should emit playTrailer without id when id is not a number', () => {
    spyOn(component.playTrailer, 'emit');
    const slide = { ...mockSlides[0], id: 'string-id' };
    component.onPlay(slide);
    expect(component.playTrailer.emit).toHaveBeenCalledWith({
      title: 'Test Movie 1',
      id: undefined
    });
  });

  it('should navigate to movie page onOpen with numeric id', () => {
    component.onOpen(mockSlides[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/movie', 1]);
  });

  it('should NOT navigate onOpen with non-numeric id', () => {
    const slide = { ...mockSlides[0], id: 'string-id' };
    component.onOpen(slide);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });


  it('should scroll active card into view after view init', () => {
    const spy = spyOn(Element.prototype, 'scrollIntoView');
    const fresh = TestBed.createComponent(SideSlider);
    fresh.componentRef.setInput('slides', mockSlides);
    fresh.componentRef.setInput('activeIndex', 0);
    fresh.detectChanges();
    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({ behavior: 'smooth', block: 'nearest' })
    );
  });

  it('should scroll when activeIndex changes to an existing card (ngOnChanges path)', () => {
    const secondCardEl = component.cards()[1]!.nativeElement as HTMLElement;
    const spy = spyOn(secondCardEl, 'scrollIntoView');

    fixture.componentRef.setInput('activeIndex', 1);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({ behavior: 'smooth', block: 'nearest' })
    );
  });

  it('should NOT scroll when active index is out of bounds', () => {
    const firstCardEl = component.cards()[0]!.nativeElement as HTMLElement;
    const spy = spyOn(firstCardEl, 'scrollIntoView');
    fixture.componentRef.setInput('activeIndex', 99);
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not throw when there are no cards', () => {
    fixture.componentRef.setInput('slides', []);
    expect(() => fixture.componentRef.setInput('activeIndex', 0)).not.toThrow();
    fixture.detectChanges();
    expect(component.cards().length).toBe(0);
  });

  it('should NOT navigate when clicking the YouTube button (stopPropagation works)', () => {
    spyOn(component.playTrailer, 'emit');
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.youtube-link');
    button.click();
    expect(component.playTrailer.emit).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate when clicking a side-card', () => {
    const card: HTMLElement = fixture.nativeElement.querySelector('.side-card');
    card.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/movie', 1]);
  });

  it('should render year and rating', () => {
    const yearEl: HTMLElement | null =
      fixture.nativeElement.querySelector('.year');
    const ratingEl: HTMLElement | null =
      fixture.nativeElement.querySelector('.rating');
    expect(yearEl?.textContent?.trim()).toBe('2023');
    expect(ratingEl?.textContent?.trim()).toBe('★ 8.5');
  });


  it('should handle slides input changes', () => {
    const newSlides = [
      ...mockSlides,
      {
        key: '3',
        id: 3,
        imgSrc: '/test3.jpg',
        title: 'Test Movie 3',
        name: 'Test Name 3',
        releaseDate: '2023-03-01',
        sourceIndex: 2,
        slot: 'right' as const,
        vmKey: '3-right',
        rating: 9.0
      }
    ];
    fixture.componentRef.setInput('slides', newSlides);
    fixture.detectChanges();
    expect(component.slides()).toEqual(newSlides);
    const cards = fixture.nativeElement.querySelectorAll('.side-card');
    expect(cards.length).toBe(3);
  });

  it('should handle activeIndex input changes', () => {
    fixture.componentRef.setInput('activeIndex', 1);
    fixture.detectChanges();
    expect(component.activeIndex()).toBe(1);
  });

  it('should not render year when releaseDate is missing', () => {
    const slides = [{ ...mockSlides[0], releaseDate: undefined }];
    fixture.componentRef.setInput('slides', slides);
    fixture.detectChanges();
    const yearEl = fixture.nativeElement.querySelector('.year');
    expect(yearEl).toBeNull();
  });

  it('should not render rating when rating is undefined', () => {
    const slides = [{ ...mockSlides[0], rating: undefined }];
    fixture.componentRef.setInput('slides', slides);
    fixture.detectChanges();
    const ratingEl = fixture.nativeElement.querySelector('.rating');
    expect(ratingEl).toBeNull();
  });

  it('should set correct aria attributes and img alt/src', () => {
    const card: HTMLElement = fixture.nativeElement.querySelector('.side-card');
    expect(card.getAttribute('aria-label')).toBe('Open Test Movie 1');
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('tabindex')).toBe('0');

    const img: HTMLImageElement =
      fixture.nativeElement.querySelector('.thumb img');
    expect(img.alt).toBe('Test Movie 1');

    const slides = [{ ...mockSlides[0], imgSrc: null }];
    fixture.componentRef.setInput('slides', slides);
    fixture.detectChanges();
    const img2: HTMLImageElement =
      fixture.nativeElement.querySelector('.thumb img');
    expect(img2.src).toContain('assets/placeholder.jpg');
  });
});
