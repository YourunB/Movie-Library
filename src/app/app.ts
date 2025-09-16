import { Component, inject, OnInit } from '@angular/core';
import { Header } from './layouts/main-layout/header/header';
import { Footer } from './layouts/main-layout/footer/footer';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authservice = inject(AuthService);
  private wasUser = localStorage.getItem('userUID');
  ngOnInit(): void {
    if (this.wasUser) {
      this.authservice.getCurrentAuthUser();
    }
  }
}
