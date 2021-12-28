# typesafe-i18n Vue.js

This is a small project demonstrating a `typesafe-i18n` integration with Vue.js version 3.

>This repository was set up using [`vite`](https://vitejs.dev) with the `vue-ts` template.

>```bash
> npm init vite@latest my-vue-app -- --template vue-ts
>```

#### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)


## Get started

Start the project in development mode:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000). You should see the example app running.

---

## Overview
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-vuejs-project)
 - [provided functions & variables](#provided-functions--variables)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Configure `typesafe-i18n` for an existing Vue.js project

Initialize `typesafe-i18n` by running

```bash
npx typesafe-i18n --setup-auto
```

You could configure your development script to run the generator in parallel to `vite` by using [`npm-run-all`](https://github.com/mysticatea/npm-run-all).

```json
{
   "scripts": {
      "dev": "npm-run-all --parallel vite typesafe-i18n",
      "vite": "vite",
      "typesafe-i18n": "typesafe-i18n"
   }
}
```

The generator will create a plugin inside `i18n-vue.ts` that you can use inside your application.

Add the `i18nPlugin` inside your `main.ts`

```ts
import { i18nPlugin } from './i18n/i18n-vue'

const app = createApp(App)
app.use(i18nPlugin, 'en') // activate plugin
app.mount('#app')
```

That's it. You can then start using `typesafe-i18n` inside your Vue.js components.

```vue
<script setup lang="ts">
import { typesafeI18n } from './i18n/i18n-vue'

const { LL } = typesafeI18n()
</script>

<template>
   {{ LL.HI({ name: 'Vue.js' })}}}
</template>
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## provided functions & variables

When running the [generator](https://github.com/ivanhofer/typesafe-i18n#typesafety), the file `i18n-vue.ts` will export following functions:

### i18nPlugin

A `Vue.js` plugin that can be added by calling `app.use()`.

The plugin can take the language the application should render as a parameter.

```ts
import { i18nPlugin } from './i18n/i18n-vue'

app.use(i18nPlugin, 'de')
```

### typesafeI18n

This function can be called in any component to inject i18n functionality:

```vue
<script setup lang="ts">
import { typesafeI18n } from './i18n/i18n-vue'

const { LL, locale, setLocale, isLoadingLocale } = typesafeI18n()
</script>
```

It injects following functions and variables:


#### LL

An initialized [`i18nObject`](https://github.com/ivanhofer/typesafe-i18n#i18nobject) you can use to translate your app.

```vue
<script setup lang="ts">
import { typesafeI18n } from './i18n/i18n-vue'

const { LL } = typesafeI18n()
</script>

<template>
   {{ LL.HI({ name: 'Vue.js' })}}} // will output e.g => 'Hi Vue.js!'
</template>
```

#### locale

A `string` containing the current selected locale.

#### isLoadingLocale

A `boolean` that indicates if the locale is currently loading. Can be useful if you have set `loadLocalesAsync` and a network request is beeing performed when switching locales.

#### setLocale

A function to set another locale for your application.

```vue
<script setup lang="ts">
import { typesafeI18n } from './i18n/i18n-vue'

const { locale, setLocale } = typesafeI18n()
</script>

<template>
   <ul className="language-selection">
      <li :class="'en' === locale ? 'selected' : ''" @click="setLocale('en')">
         english
      </li>
      <li :class="'de' === locale ? 'selected' : ''" @click="setLocale('de')">
         deutsch
      </li>
      <li :class="'it' === locale ? 'selected' : ''" @click="setLocale('it')">
         italiano
      </li>
   </ul>
</template>
```
