import { Component } from '@angular/core';
import { Header } from './layouts/main-layout/header/header';
import { TradingMovies } from './layouts/main-layout/trading-movies/trading-movies';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, TradingMovies],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}

