# `typesafe-i18n` Svelte

**You can find a demo Svelte implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-svelte/examples/svelte)**

**You can find a demo SvelteKit implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-svelte/examples/svelte-kit)**

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

---

## Table of Contents
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-svelte-project)
 - [available Svelte stores](#stores)
 - [SvelteKit projects](#sveltekit)
 - [Sapper projects](#sapper)


<!-- ------------------------------------------------------------------------------------------
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Configure `typesafe-i18n` for an existing Svelte project

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
      "typesafe-i18n": "typesafe-i18n",
   }
}
```

The generator will create some custom Svelte stores inside `i18n-svelte.ts` that you can use inside your components.

Then inside your root-component, you need to load your locales and call `setLocale` in order to setup all stores.

```html
<script lang="ts">
   import { setLocale } from './i18n/i18n-svelte'

   // TODO: load locales (https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#loading-locales)

   setLocale()
</script>

<!-- HTML markup -->
```

That's it. You can then start using `typesafe-i18n` inside your Svelte application.

```html
<script lang="ts">
   import LL from './i18n/i18n-svelte'
</script>

<h1>{$LL.HELLO({ name: 'Svelte' })}</h1> <!-- "Hello Svelte!" -->
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Stores

When running the [generator](https://github.com/ivanhofer/typesafe-i18n#typesafety), the file `i18n-svelte.ts` will export following functions and readable stores:


### initI18n

Call it inside your root Svelte component in order to setup the stores:

```html
<script>
   import { initI18n } from './i18n/i18n-svelte'

   initI18n('en')
</script>
```


### LL

The default export of the generated file will be the store you can use to translate your app. You can use it with subscriptions (`$LL`) or as a regular JavaScript object (`LL`).

```html
<script>
   import LL from './i18n/i18n-svelte'

   const showMessage = () => {
      alert($LL.SOME_MESSAGE())
   }
</script>

{$LL.HELLO({ name: 'world' })}

<button on:click={showMessage}>click me</button>
```

You can also use the translations in a regular TypeScript (or JavaScript) file:

```ts
import { get } from 'svelte/store'
import LL from './i18n/i18n-svelte'

console.log(get(LL).SOME_MESSAGE())
```

### locale

This Svelte store will contain the current selected locale.

```html
<script>
   import { locale } from './i18n/i18n-svelte'
</script>

<div>
   your language is: {$locale}
</div>
```


### setLocale

If you want to change the locale, you need to call `setLocale` with the locale as an argument.

```html
<script>
   import { setLocale } from './i18n/i18n-svelte'
</script>

<div id="language-picker">

   Choose language:

   <button on:click={() => setLocale('en')}>
      english
   </button>

   <button on:click={() => setLocale('de')}>
      deutsch
   </button>

   <button on:click={() => setLocale('it')}>
      italiano
   </button>

</div>
```

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->


# SvelteKit

- See SvelteKit with TypeScript example [here](https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit)
- See SvelteKit with JavaScript + JSDocs example [here](https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit-jsdoc)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->


# Sapper

For your Sapper projects, you should call the `loadLocaleAsync` function inside `preload` in your root `routes/_layout.svelte` file:

```html
<script lang="ts" context="module">
   import { loadFormatters, loadLocaleAsync } from '../i18n/i18n-util.async'
   import { loadedLocales } from '../i18n/i18n-util'

   export async function preload(page, session) {
      // detect locale of user (see https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/detectors)
      const locale = 'en'
      await loadLocaleAsync(locale)

      // access the loaded translations and send it as a prop to the layout
      const translations = loadedLocales[locale]

      return { locale, translations }
   }
</script>

<script lang="ts">
   import LL, { setLocale } from '../i18n/i18n-svelte'
   import type { Locales, Translation } from '../i18n/i18n-types'

   export let locale: Locales
   export let translations: Translation

   // restore the translations from the received props
   loadedLocales[locale] = translations
   loadFormatters(locale)

   setLocale(locale)
</script>

<h1>{$LL.HI({ name: 'Sapper' })}</h1>
```

> Due to how sapper works, the `preload` function on the first request only get's called on the server. To be able to access the translations also in the client, you need to send the loaded translations via a prop to the client and restore the state there.

For more information about the stores you can use, see the [Stores](#stores) section.

 <!-- TODO: create example repository -->


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

# Notes

You may run into the error **`Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'svelte' imported from ...`**, when using the `node` adapter from `SvelteKit`. The reason behind this is that `typesafe-i18n` uses the stores that Svelte includes. There is currently an unresolved question how dependencies, that itself depend on `Svelte` can and should be bundled. Until that question is resolved you can do two things:

1. move `Svelte` to your production `dependencies` inside `package.json`
2. _(recommended)_ move `typesafe-i18n` to your `devDependencies` inside `package.json` and tell `vite` to bundle it by adding a few lines to your config:

   _vite.config.js_
   ```diff
   export default defineConfig({
	   plugins: [sveltekit()],
   +	ssr: {
   +		noExternal: ['typesafe-i18n'],
   +	},
   })
   ```

---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**

---
---

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## recipes

### How do I render a component inside a Translation?

By default `typesafe-i18n` at this time does not provide such a functionality. But you could easily write a function like this:

```svelte
<script lang="ts">
	import type { LocalizedString } from 'typesafe-i18n'

	export let message: LocalizedString

	$: [prefix, infix, postfix] = message.split('<>') as LocalizedString[]
	// render infix only if the message doesn't have any split characters
	$: if (!infix && !postfix) {
		infix = prefix
		prefix = '' as LocalizedString
	}
</script>

{prefix}<slot {infix} />{postfix}
```

Your translations would look something like this

```ts
const en = {
   'WELCOME': 'Hi {name:string}, click <>here<> to create your first project'
   'LOGOUT': 'Logout'
}
```

Use it inside your application

```svelte
<header>
   <!-- normal usage -->
   <button on:click={() => alert('do logout')}>
      {LL.logout()}
   </button>
</header>
<main>
   <!-- usage with a component inside a translation -->
   <WrapTranslation message={LL.WELCOME({ name: 'John' })} let:infix>
      <button on:click={() => alert('clicked')}>
         {infix}
      </button>
   </WrapTranslation>
</main>
```
