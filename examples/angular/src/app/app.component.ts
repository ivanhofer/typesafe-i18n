import { Component } from '@angular/core';
import { TranslationFunctions } from '../i18n/i18n-types';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

  constructor(private i18nService: I18nService) {
    i18nService.initI18n('en').then(() => {
      // eslint-disable-next-line no-console
      console.log(this.LL.WELCOME())
    })
  }

  get LL(): TranslationFunctions { return this.i18nService.LL }

}
