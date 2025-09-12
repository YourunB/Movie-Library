import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {

}
