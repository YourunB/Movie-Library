import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { languages, LanguageService } from '../../services/language.service';
import { Languages } from '../../../../models/dashboard';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-select-languages',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './select-languages.html',
  styleUrl: './select-languages.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SelectLanguages {
  private languageService = inject(LanguageService);
  languages: Languages[] = languages;
  isSelectLanguage = false;

  selectedLang: string =
    localStorage.getItem('language')?.toLocaleUpperCase() || 'EN';

  onLanguageChange(newValue: string) {
    this.selectedLang = newValue;
    this.languageService.changeLanguage(this.selectedLang.toLocaleLowerCase());
    this.isSelectLanguage = false;
  }

  changeSelectStatus() {
    this.isSelectLanguage = !this.isSelectLanguage;
  }
}
