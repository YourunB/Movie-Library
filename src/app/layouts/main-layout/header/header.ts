import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectMenuOpen } from '../../../../store/ui.selectors';
import { toggleMenu } from '../../../../store/ui.actions';
import { Menu } from './menu/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  standalone: true,
  styleUrls: ['./header.scss'],
  imports: [FormsModule, Menu, CommonModule, RouterLink]
})
export class Header{
  private store = inject(Store);
  menuOpen$ = this.store.select(selectMenuOpen);

  query = '';
  searchCategory = 'all';

  private router = inject(Router);

  search() {
    if (this.query.trim()) {
      this.router.navigate(['/search'], {
        queryParams: {
          q: this.query.trim(),
          category: this.searchCategory
        }
      });
    }
  }

  toggleMenu() {
    this.store.dispatch(toggleMenu());
  }
}
