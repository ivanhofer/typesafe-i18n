import { Directive } from '@angular/core';
import { TranslationFunctions } from './i18n-types';
import { I18nService } from './i18n.service';

@Directive()
export abstract class I18nComponent {
  constructor(private i18nService: I18nService) { }

  get LL(): TranslationFunctions { return this.i18nService.LL }
}
