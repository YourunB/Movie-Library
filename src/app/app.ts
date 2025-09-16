import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from './layouts/main-layout/header/header';
import { TradingMovies } from './layouts/main-layout/trading-movies/trading-movies';
import { PopularPeopleSlider } from "./layouts/main-layout/popular-slider/popular-slider";
import { UpcomingMovies } from "./layouts/main-layout/upcoming-movies/upcoming-movies";
import { NowPlayingMovies } from "./layouts/main-layout/now-playing-movies/now-playing-movies";
import { TodaysHighlights } from "./layouts/main-layout/todays-highlights/todays-highlights";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, TradingMovies, PopularPeopleSlider, UpcomingMovies, NowPlayingMovies, TodaysHighlights],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}

