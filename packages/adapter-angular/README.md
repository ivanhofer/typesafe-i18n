# `typesafe-i18n` Angular

**You can demo implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-angular/example)**

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

## Table of Contents
 - [add `typesafe-i18n` to an existing Angular project](#configure-typesafe-i18n-for-an-existing-angular-project)
 - [generated service](#generated-service)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Configure `typesafe-i18n` for an existing Angular project


Initialize `typesafe-i18n` by running

```bash
npx typesafe-i18n --setup-auto
```

You could configure your development script to run the generator in parallel to `ng serve` by using [`npm-run-all`](https://github.com/mysticatea/npm-run-all).

```json
{
   "scripts": {
      "dev": "npm-run-all --parallel start typesafe-i18n",
      "typesafe-i18n": "typesafe-i18n",
      "start": "ng serve",
  }
}
```

The generator will create a custom Angular Service inside `i18n.service.ts` that you can use inside your application.

That's it. You can then start using `typesafe-i18n` inside your Angular components.


_greeting.component.ts_
```typescript
import { Component } from '@angular/core'
import { TranslationFunctions } from '../i18n/i18n-types'
import { I18nService } from '../i18n/i18n.service'

@Component({
   selector: 'app-greeting',
   templateUrl: './greeting.component.html',
})
export class GreetingComponent {
   constructor(private i18nService: I18nService) { }

   get LL(): TranslationFunctions {
      return this.i18nService.LL
   }
}
```

_greeting.component.html_
```html
<p>{{ LL.HI({ name: 'John' }) }}</p>
```

## generated service

The service gives you access to following variables:

#### LL

An initialized [`i18nObject`](https://github.com/ivanhofer/typesafe-i18n#i18nobject) you can use to translate your app.

#### locale

A `string` containing the current selected locale.

#### setLocale

A function to set another locale for the context.

```typescript
import { Component } from '@angular/core'
import { Locales } from '../i18n/i18n-types'
import { locales } from '../i18n/i18n-util'
import { I18nService } from '../i18n/i18n.service'

@Component({
   selector: 'app-language-switcher',
   templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
   constructor(private i18nService: I18nService) {	}

   setLocale(locale: Locales): void {
      // TODO: load locales (https://github.com/ivanhofer/typesafe-i18n#loading-locales)

      this.i18nService.setLocale(locale)
   }
}
```


---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**