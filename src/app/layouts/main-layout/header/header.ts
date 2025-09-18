import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectMenuOpen } from '../../../../store/ui.selectors';
import { toggleMenu } from '../../../../store/ui.actions';
import { Menu } from './menu/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth.service';
import { signOut, User } from 'firebase/auth';
import { MatIconModule } from '@angular/material/icon';
import { auth } from '../../../shared/api/farebase';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  standalone: true,
  styleUrls: ['./header.scss'],
  imports: [FormsModule, Menu, CommonModule, RouterLink, MatIconModule, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  private store = inject(Store);
  menuOpen$ = this.store.select(selectMenuOpen);

  query = '';
  searchCategory = 'all';

  private router = inject(Router);

  private authService = inject(AuthService);
  user: User | null = null;
  isAuthenticated = false;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.authService.getUserObservable().subscribe((user) => {
      this.user = user;
      this.cdr.detectChanges();
    });
    this.authService.getAuthenticatedObservable().subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
      this.cdr.detectChanges();
    });
  }

  search() {
    if (this.query.trim()) {
      this.router.navigate(['/search'], {
        queryParams: {
          q: this.query.trim(),
          category: this.searchCategory,
        },
      });
    }
  }

  toggleMenu() {
    this.store.dispatch(toggleMenu());
  }

  logout() {
    signOut(auth);
    this.authService.resetUser();
    this.router.navigate(['/signin']);
  }
}
