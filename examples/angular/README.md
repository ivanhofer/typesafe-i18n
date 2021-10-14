# typesafe-i18n Angular

This is a small project demonstrating a `typesafe-i18n` integration with Angular.

> This repository was set up using the [Angular CLI](https://angular.io/cli).


## Get started

Start the project in development mode:

```bash
npm run dev
```

Navigate to [http://localhost:4200](http://localhost:4200). You should see the example app running.

# Overview
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-react-project)
 - [generated component & context](#generated-component--context)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

# Configure `typesafe-i18n` for an existing Angular project

Configure `typesafe-i18n` by creating the file `.typesafe-i18n.json` with following contents:

```json
{
   "$schema": "https://unpkg.com/typesafe-i18n@2.40.1/schema/typesafe-i18n.json",

   "adapter": "angular"
}
```

Run the generator e.g. by adding a new script inside your `package.json` file.
You could configure your development script to run the generator in parallel to `ng serve`.

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

```typescript
import { Component } from '@angular/core'
import { TranslationFunctions } from '../i18n/i18n-types'
import { I18nService } from '../i18n/i18n.service'

@Component({
   selector: 'app-greeting',
   templateUrl: './greeting.component.html',
})
export class GreetingComponent {
   constructor(private i18nService: I18nService) {	}

   get LL(): TranslationFunctions {
      return this.i18nService.LL
   }
}
```

```html
<p>{{ LL.HI({ name: 'John' }) }}</p>
```


The service gives you access to following variables:

#### LL

An initialized [`i18nObject`](https://github.com/ivanhofer/typesafe-i18n#i18nobject) you can use to translate your app.

#### locale

A `string` containing the current selected locale.

#### isLoadingLocale

A `boolean` that indicates if the locale is currently loading. Can be useful if you have set `loadLocalesAsync` and a network request is beeing performed when switching locales.

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
      this.i18nService.setLocale(locale)
   }
}
```


---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**