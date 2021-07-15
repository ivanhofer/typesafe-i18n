import { Component } from '@angular/core';
import { I18nComponent } from 'src/i18n/i18n.component';
import { I18nService } from 'src/i18n/i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends I18nComponent {
  title = 'angular';

  constructor(i18nService: I18nService) {
    super(i18nService)

    i18nService.initI18n('en').then(() => {
      // eslint-disable-next-line no-console
      console.log(this.LL.WELCOME())
    })
  }
}
