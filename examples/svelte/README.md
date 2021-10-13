# typesafe-i18n Svelte

This is a small project demonstrating a `typesafe-i18n` integration with Svelte.

> This is a clone from the [Svelte](https://svelte.dev) template (see https://github.com/sveltejs/template). The template was then converted to TypeScript:
>```bash
>npx degit sveltejs/template my-svelte-project
>cd my-svelte-project
>node scripts/setupTypeScript.js
>
>npm install
>```

## Get started

Start [Rollup](https://rollupjs.org) in development mode:

```bash
npm run dev
```

Navigate to [http://localhost:5000](http://localhost:5000). You should see the example app running.

# Overview
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-svelte-project)
 - [available Svelte stores](#stores)
 - [SvelteKit projects](#sveltekit)
 - [Sapper projects](#sapper)
 - [JavaScript projects](#usage-in-javascript-projects)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

# Configure `typesafe-i18n` for an existing Svelte project

Configure `typesafe-i18n` by creating the file `.typesafe-i18n.json` with following contents:

```json
{
   "$schema": "https://unpkg.com/typesafe-i18n@2.40.1/schema/typesafe-i18n.json",

   "adapter": "svelte",
   "loadLocalesAsync": false
}
```
> if in your 'rollup.config.js' file 'config.format' is set 'iife' , you need to set 'loadLocalesAsync' to 'false'

Run the generator e.g. by adding a new script inside your `package.json` file.
You could configure your development script to run the generator in parallel to `rollup -c -w`.

```json
{
   "scripts": {
      "dev": "npm-run-all --parallel rollup typesafe-i18n-generator",
      "typesafe-i18n-generator": "typesafe-i18n",
      "rollup": "rollup -c -w",
   }
}
```

The generator will create some custom Svelte stores inside `i18n-svelte.ts` that you can use inside your components.

Then inside your root-component, you need to call `initI18n` in order to setup all stores.

```html
<script lang="ts">
   import { initI18n } from './i18n/i18n-svelte'

   initI18n()
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
      alert(LL.SOME_MESSAGE())
   }
</script>

{$LL.HELLO({ name: 'world' })}

<button on:click={showMessage}>click me</button>
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

### isLocaleLoading

Svelte store that returns a `boolean`. It can be used to wait for the locale to be loaded.

```html
<script>
   import { isLocaleLoading } from './i18n/i18n-svelte'
</script>

{#if $isLocaleLoading}
   loading...
{:else}

   <!-- your app code goes here  -->

{/if}
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->


# SvelteKit

For your SvelteKit projects, you should call `initI18n` inside the `load` function in your `routes/__layout.svelte` file:

```html
<script context="module">
	import LL, { initI18n, setLocale } from '../i18n/i18n-svelte';

	export async function load({ page, fetch, session, context }) {
      // detect locale of user (see https://github.com/ivanhofer/typesafe-i18n#locale-detection)
      const locale = 'en'
		await initI18n(locale)

		return {}
	}
</script>
```

For more information about the stores you can use, see the [Svelte](#svelte) section.

 <!-- TODO: create example repository -->


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->


# Sapper

For your Sapper projects, you should call the `initI18n` function inside `preload` in your root `routes/_layout.svelte` file:

```html
<script context="module">
   import { initI18n } from '../i18n/i18n-svelte'

   export async function preload(page, session) {
      // detect locale of user (see https://github.com/ivanhofer/typesafe-i18n#locale-detection)
      const locale = 'en'
      await initI18n(locale)
   }
</script>
```

For more information about the stores you can use, see the [Svelte](#svelte) section.

 <!-- TODO: create example repository -->


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

# usage in JavaScript projects

Since you can't take advantage of the generated types, you need to import the stores directly from 'typesafe-i18n/svelte/svelte-store'.\
When initializing you need to pass a callback to load the translation and an optional callback to initialize your formatters.

```typescript
import LL, { initI18n } from 'typesafe-i18n/svelte/svelte-store'

const localeTranslations = {
   en: { TODAY: "Today is {date|weekday}" },
   de: { TODAY: "Heute ist {date|weekday}" },
   it: { TODAY: "Oggi è {date|weekday}" },
}

const loadLocale = (locale) => localeTranslations[locale]

const initFormatters = (locale) => {
   const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' })

   return {
      weekday: (value) => dateFormatter.format(value)
   }
}

initI18n('en', loadLocale, initFormatters)

$LL.TODAY(new Date()) // => 'Today is friday'
```

---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**