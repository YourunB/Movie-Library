import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, AfterViewInit, ElementRef, OnChanges, ChangeDetectionStrategy, Output, EventEmitter, inject, input, viewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [CommonModule, DatePipe, DecimalPipe, TranslatePipe],
  templateUrl: './side-slider.html',
  styleUrls: ['./side-slider.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideSlider implements AfterViewInit, OnChanges {
  slides = input<SideSlide[]>([]);
  activeIndex = input<number>(0);

  @Output() playTrailer = new EventEmitter<{ title: string; id?: number }>();
  cards = viewChildren<ElementRef<HTMLDivElement>>('card');
  trackByVmKey = (_: number, s: SideSlide) => s.vmKey;

  private readonly router = inject(Router);

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

  onOpen(s: SideSlide): void {
    if (typeof s.id === 'number') {
      this.router.navigate(['/movie', s.id]);
    }
  }

  private scrollToActive(): void {
    const idx = this.activeIndex();
    const cards = this.cards();
    if (cards && cards[idx]) {
      cards[idx]!.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }
}
