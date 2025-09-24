import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../shared/services/language.service';
import { Developer } from '../../../models/dashboard';

@Component({
  selector: 'app-about.page',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})

export class AboutPage {
  creationDate = '2025';

  projectDescription = `
    This project is an IMDb clone built using the TMDB API.
    Firebase is integrated for authentication and database storage.
  `;

  rsSchool = {
    name: 'RS School Angular',
    url: 'https://rs.school/angular',
    description:
      'The course covers Angular fundamentals, RxJS, routing, API integration, and application architecture.',
  };

  developers: Developer[] = [
    {
      name: {
        en: 'Yury',
        ru: 'Юрий',
        pl: 'Yury',
      },
      githubUsername: 'yourunb',
      githubUrl: 'https://github.com/yourunb',
    },
    {
      name: {
        en: 'Anastasiya',
        ru: 'Анастасия',
        pl: 'Anastasiya',
      },
      githubUsername: 'anastan588',
      githubUrl: 'https://github.com/anastan588',
    },
    {
      name: {
        en: 'Roman',
        ru: 'Роман',
        pl: 'Roman',
      },
      githubUsername: 'RamanMilashevich',
      githubUrl: 'https://github.com/RamanMilashevich',
    },
  ];

  selectedLang: string = localStorage.getItem('language') || 'en';
  private languageService = inject(LanguageService);
  constructor() {
    this.languageService.language$.subscribe((lang) => {
      this.selectedLang = lang;
    });
  }
}
