# `typesafe-i18n` Vue.js

**You can find a demo implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-vue/example).**

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

---

## Table of Contents
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

// TODO: load locales (https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#loading-locales)

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

When running the [generator](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#generator), the file `i18n-vue.ts` will export following functions:

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

const { LL, locale, setLocale } = typesafeI18n()
</script>
```

It injects following functions and variables:


#### LL

An initialized [`i18nObject`](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/runtime#i18nObject) you can use to translate your app.

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
