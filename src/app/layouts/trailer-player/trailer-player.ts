import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-trailer-player',
  standalone: true,
  imports: [],
  templateUrl: './trailer-player.html',
  styleUrl: './trailer-player.scss'
})
export class TrailerPlayer implements OnChanges {
  @Input() movieId?: number;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();


  ngOnChanges(changes: SimpleChanges): void {

  }

}
