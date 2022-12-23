# `typesafe-i18n` Vue.js

**You can find a demo vue implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-vue/examples/vue).**

**You can find a demo Nuxt.js implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-vue/examples/nuxtjs).**

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
 - [recipes](#recipes)


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

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## recipes

### How to update all namespaces on locale change

When loading namespaces asynchronously, they are not automatically updated on locale change. To do this, you could wrap the typesafe-i18n utils in a composable, like this:

```ts
// src/composables/useLocales.ts
import { ref, watch } from 'vue'
import { loadLocaleAsync, loadNamespaceAsync } from '../i18n/i18n-util.async'
import { typesafeI18n } from '../i18n/i18n-vue'

// keep track of loaded namespaces
const loadedNamespaces: Namespaces[] = []

// a way to track namespaces, without storing them, would be to check the list
// of namespaces (export namespaces in i18n-util) against the loaded locales
// (export loadedLocales in i18n-util), like:
//
// import { namespaces, loadedLocales } from '@/i18n/i18n-util'
// const loadedNamespaces = namespaces.map(ns => ns in loadedLocales[locale])

/**
 * Load a new locale and all currently loaded namespaces
 *
 * @param locale - the new locale
 * @setLocale - the actual setLocale function, coming from typesafe-i18n
 *
 * @returns a promise that resolves after loading the new locale and all namespaces
 */
function loadEverything(
  locale: Locales,
  setLocale: (l: Locales) => void,
) {
  const loaders = [
    loadLocaleAsync(locale),
    ...loadedNamespaces.map(ns => loadNamespaceAsync(ns))
  ]
  return Promise.all(loaders).then(() => setLocale(locale))
}

/**
 * Provides i18n utils with automatic namespace tracking
 * @returns an object containing i18n utils
 *   ready: Ref<boolean> - tracks if locales are currently loading
 *   locale: Ref<Locales> - always contains the currently set locale
 *   setLocale: (locale: Locales) => Promise<void> - set a locale
 *   addNamespace: (ns: Namespaces) => Promise<void> - load and add a namespace
 */
export default function useLocales() {
  const ready = ref(false)
  const { locale, setLocale: _setLocale, LL } = typesafeI18n()

  // sets a new locale and uses ready to indicate the loading state, but also
  // returns the Promise coming from `loadEverything`
  const setLocale: (locale: Locales) => {
    ready.value = false
    return loadEverything(newLocale, _setLocale).then(() => {
      ready.value = true
    })
  }

  // adds and loads a namespace if it is not yet added, and uses ready to
  // indicate the loading state, but also
  // returns the Promise coming from `loadNamespaceAsync`
  const addNamespace(ns: Namespaces) {
    if (loadedNamespaces.includes(ns)) return
    ready.value = false
    return loadNamespaceAsync(ns).then(() => {
      loadedNamespaces.push(ns)
      ready.value = true
    })
  }

  return { ready, locale, setLocale, addNamespace, LL }
}
```

### Pre-/Post setLocale/addNamespace hooks

The above code can be extended to call functions before or after a locale is set. For this, add a mean to give those callbacks as params to `useLocales` and call them in their respective places:

```ts
// src/composables/useLocales.ts
import { ref, watch } from 'vue'
import { loadLocaleAsync, loadNamespaceAsync } from '../i18n/i18n-util.async'
import { typesafeI18n } from '../i18n/i18n-vue'

// keep track of loaded namespaces
const loadedNamespaces: Namespaces[] = []

/**
 * Load a new locale and all currently loaded namespaces
 *
 * @param locale - the new locale
 * @setLocale - the actual setLocale function, coming from typesafe-i18n
 *
 * @returns a promise that resolves after loading the new locale and all namespaces
 */
function loadEverything(
  locale: Locales,
  setLocale: (l: Locales) => void,
) {
  const loaders = [
    loadLocaleAsync(locale),
    ...loadedNamespaces.map(ns => loadNamespaceAsync(ns))
  ]
  return Promise.all(loaders).then(() => setLocale(locale))
}

/**
 * Provides i18n utils with automatic namespace tracking
 *
 * @param options - object, optionally containing hooks to be called before/after setting a locale/namespace
 *
 * @returns an object containing i18n utils
 *   ready: Ref<boolean> - tracks if locales are currently loading
 *   locale: Ref<Locales> - always contains the currently set locale
 *   setLocale: (locale: Locales) => Promise<void> - set new locale
 *   addNamespace: (ns: Namespaces) => Promise<void> - load a new namespace
 */
export default function useLocales({
  beforeSetLocale,
  afterSetLocale,
  beforeAddNamespace,
  afterAddNamespace,
}: {
  beforeSetLocale?: (newLocale: Locales, oldLocale: Locales) => void
  afterSetLocale?: (newLocale: Locales, oldLocale: Locales) => void
  beforeAddNamespace?: (newNS: Namespaces, loadedNS: Namespaces[]) => void
  afterAddNamespace?: (newNS: Namespaces, loadedNS: Namespaces[]) => void
} = {}) {
  const ready = ref(false)
  const { locale, setLocale: _setLocale, LL } = typesafeI18n()

  // Sets a new locale and uses ready to indicate the loading state,
  // calls beforeSetLocale after setting ready to false, right before `loadEverything` is called.
  // calls afterSetLocale after `loadEverything` and setting ready to true.
  // returns the Promise coming from `loadEverything`
  const setLocale: (newLocale: Locales) => {
    ready.value = false
    const oldLocale = locale.value
    if (beforeSetLocale) beforeSetLocale(newLocale, oldLocale)
    return loadEverything(newLocale, _setLocale).then(() => {
      ready.value = true
      if (afterSetLocale) afterSetLocale(newLocale, oldLocale)
    })
  }

  // Adds and loads a namespace if it is not yet added, and uses ready to
  // indicate the loading state.
  // Calls beforeAddNamespace after setting ready to false, right before `loadNamespaceAsync` is called.
  // Calls afterAddNamespace after loadNamespaceAsync and setting ready to true.
  // returns the Promise coming from `loadNamespaceAsync`
  const addNamespace(ns: Namespaces) {
    ready.value = false
    if (beforeAddNamespace) beforeAddNamespace(ns, loadedNamespaces)
    if (loadedNamespaces.includes(ns)) {
      ready.value = true
      return
    }
    return loadNamespaceAsync(ns).then(() => {
      loadedNamespaces.push(ns)
      ready.value = true
      if (afterAddNamespace) afterAddNamespace(ns, loadedNamespaces)
    })
  }

  return { ready, locale, setLocale, addNamespace, LL }
}
```
