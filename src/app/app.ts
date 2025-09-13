import { Component } from '@angular/core';
import { Header } from './layouts/main-layout/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}

