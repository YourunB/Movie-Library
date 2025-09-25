import { DatePipe, DecimalPipe } from '@angular/common';
import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ElementRef,
  OnChanges,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
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
  imports: [DatePipe, DecimalPipe, TranslatePipe],
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
    if (this.cards && this.cards.get(this.activeIndex)) {
      this.cards.get(this.activeIndex)!.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }
}
