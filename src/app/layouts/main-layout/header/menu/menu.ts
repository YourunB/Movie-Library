import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { closeMenu } from '../../../../../store/ui/ui.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private store = inject(Store);

  close() {
    this.store.dispatch(closeMenu());
  }
}
