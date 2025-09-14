import { Component } from '@angular/core';
import { Header } from './layouts/main-layout/header/header';
import { Footer } from './layouts/main-layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
