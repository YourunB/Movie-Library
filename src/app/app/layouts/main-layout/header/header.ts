import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  standalone: true,
  styleUrls: ['./header.scss'],
  imports: [FormsModule]
})
export class Header{
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
}
