import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, ViewChildren, QueryList, AfterViewInit, ElementRef, OnChanges, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

interface SideSlide {
  key: string;
  id: number | string;
  imgSrc: string | null;
  title?: string;
  name?: string;
  releaseDate?: string;
  sourceIndex: number;
  slot: 'left' | 'mid' | 'right';
  vmKey: string;
  rating?: number;
}

@Component({
  selector: 'app-side-slider',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterModule],
  templateUrl: './side-slider.html',
  styleUrls: ['./side-slider.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideSlider implements AfterViewInit, OnChanges {
  @Input() slides: SideSlide[] = [];
  @Input() activeIndex = 0;

  @Output() playTrailer = new EventEmitter<{ title: string; id?: number }>();
  @ViewChildren('card') cards!: QueryList<ElementRef<HTMLDivElement>>;
  trackByVmKey = (_: number, s: SideSlide) => s.vmKey;


  ngAfterViewInit(): void {
    this.scrollToActive();
  }

  ngOnChanges(): void {
    this.scrollToActive();
  }

  getLabel(slide: SideSlide): string {
    return slide.title ?? slide.name ?? '';
  }

  onPlay(s: SideSlide): void {
    this.playTrailer.emit({
      title: s.title ?? s.name ?? 'Untitled',
      id: typeof s.id === 'number' ? s.id : undefined,
    });
  }

  private scrollToActive(): void {
    if (this.cards && this.cards.get(this.activeIndex)) {
      this.cards.get(this.activeIndex)!.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }
}
