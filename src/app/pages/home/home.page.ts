import { Component } from '@angular/core';
import { TradingMovies } from '../../layouts/main-layout/trading-movies/trading-movies';
import { NowPlayingMovies } from '../../layouts/main-layout/now-playing-movies/now-playing-movies';
import { PopularPeopleSlider } from '../../layouts/main-layout/popular-slider/popular-slider';
import { UpcomingMovies } from '../../layouts/main-layout/upcoming-movies/upcoming-movies';
import { TodaysHighlights } from '../../layouts/main-layout/todays-highlights/todays-highlights';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TradingMovies,
    NowPlayingMovies,
    PopularPeopleSlider,
    UpcomingMovies,
    TodaysHighlights,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {}
