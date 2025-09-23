import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about.page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss']
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
    description: 'The course covers Angular fundamentals, RxJS, routing, API integration, and application architecture.'
  };

  developers = [
    {
      name: 'Yury',
      githubUsername: 'yourunb',
      githubUrl: 'https://github.com/yourunb'
    },
    {
      name: 'Anastasiya',
      githubUsername: 'anastan588',
      githubUrl: 'https://github.com/anastan588'
    },
    {
      name: 'Roman',
      githubUsername: 'RamanMilashevich',
      githubUrl: 'https://github.com/RamanMilashevich'
    }
  ];
}
