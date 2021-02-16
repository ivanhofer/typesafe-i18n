
An opinionated, full type-safe, lightweight localization library for TypeScript projects with no external dependencies.

---
---
---
---
---

## This package was renamed to `typesafe-i18n`. Please visit the [new package location](https://www.npmjs.com/package/typesafe-i18n).

---
---
---
---
---

## Motivation

There exist a lot of localization libraries. But I could not find any solution that meet my requirements.

I want something that:
 - is [lightweight](#browser) (< 1 kb)
 - has an [easy to use syntax](#syntax)
 - supports [plural rules](#plural)
 - allows [formatting](#formatters) of values e.g. locale-dependent date or number formats
 - can be used for [frontend, backend and API](#usage) projects
 - [prevents me from making mistakes](#typesafety)

Long story short: I created my own localization library. The outcome was better than I could have imagined. Going down the rabbit hole, I came up with a solution that checks whether you call the translation-function with the correct amount of arguments, if the types of the arguments are correct and your translations for other locales contain all required arguments.\
This package consists of a [translation-function](#langaugeStringWrapper), as well as an [generator](#typesafety) for TypeScript code. By looking at your base translation, it can output type definitions, to make your (developer-)life easier.

 > The package can be used inside JavaScript and TypeScript applications, but you will get a lot of benefits using it together with TypeScript, since the [watcher](#typesafety) will generate a few wrappers for easier usage.

<!-- TODO: make a gif demonstrating langauge -->

#### Why this name?

I got a typo when I tried to write language. So the package-name became langauge.

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Installation

```
$ npm install --save langauge
```

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Syntax

For more information about the `LLL` object, read the [usage](#Usage) section.

<!-- ------------------------------------------------------------------------------------------ -->

### arguments:

 > Syntax: `{index}`

```typescript
const APPLES = '{0} apples'

LLL(APPLES, 12) => '12 apples'
```

<!-- ------------------------------------------------------------------------------------------ -->

### multiple arguments:

```typescript
const FRUITS = '{0} apples and {1} bananas'

LLL(FRUITS, 3, 7) => '3 apples and 7 bananas'
```

<!-- ------------------------------------------------------------------------------------------ -->

### keyed arguments:

 > Syntax: `{key}`

```typescript
const FRUITS = '{nrOfApples} apples and {nrOfBananas} bananas'

LLL(FRUITS, { nrOfApples: 3, nrOfBananas: 7 }) => '3 apples and 7 bananas'
```

<!-- ------------------------------------------------------------------------------------------ -->

### plural:

 > Syntax: `{{singular|plural}}`

```typescript
const APPLES = '{nrOfApples} {{apple|apples}}'

LLL(APPLES, { nrOfApples: 1 }) => '1 apple'
LLL(APPLES, { nrOfApples: 2 }) => '2 apples'
```

<!-- ------------------------------------------------------------------------------------------ -->

### plural (short version):

 > Syntax: `{{plural}}`

```typescript
const APPLES = '{nrOfApples} apple{{s}}'

LLL(APPLES, { nrOfApples: 0 }) => '0 apples'
LLL(APPLES, { nrOfApples: 1 }) => '1 apple'
LLL(APPLES, { nrOfApples: 5 }) => '5 apples'
```
<!-- ------------------------------------------------------------------------------------------ -->

### plural (only singular):

 > Syntax: `{{singular|}}`

```typescript
const MEMBERS = '{0} weitere{{s|}} Mitglied{{er}}'

LLL(MEMBERS, 0) => '0 weitere Mitglieder'
LLL(MEMBERS, 1) => '1 weiteres Mitglied'
LLL(MEMBERS, 9) => '9 weitere Mitglieder'
```

### plural (full syntax):

Under the hood, langauge uses the [Intl.PluralRules](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) for detecting the plural form.

 > Syntax: `{{zero|one|two|few|many|other}}`

```typescript
// locale set to 'ar-EG'

const PLURAL = 'I have {{zero|one|two|a few|many|a lot}} apple{{s}}'

LLL(PLURAL, 0) => 'I have zero apples'
LLL(PLURAL, 1) => 'I have one apple'
LLL(PLURAL, 2) => 'I have two apples'
LLL(PLURAL, 6) => 'I have a few apples'
LLL(PLURAL, 18) => 'I have many apples'
```

<!-- ------------------------------------------------------------------------------------------ -->


### format values:

Read the [formatters](#formatters) section to learn how you can configure formatters.

```typescript
const now = Date.now()

LLL('Today is {date|weekday}', { date: now }) => 'Today is Friday'
LLL('Heute ist {date|weekday}', { date: now }) => 'Heute ist Freitag'
```

Allows also to format values by multiple formatters in row. The formatters will be called from left to right.

```typescript
const now = Date.now()

LLL('Today is {date|weekday}', { date: now }) => 'Today is Friday'
LLL('Today is {date|weekday|uppercase}', { date: now }) => 'Today is FRIDAY'
LLL('Today is {date|weekday|uppercase|shorten}', { date: now }) => 'Today is FRI'
```


<!-- ------------------------------------------------------------------------------------------ -->

### typesafe nr of arguments:

For information about the `LL` object, read the [usage](#Usage) section.

```typescript
const translation = {
   HI: 'Hello {0}'
}

LL.HI() // => ERROR: Expected 1 arguments, but got 0.
LL.HI('John', 'Jane') // => ERROR: Expected 1 arguments, but got 2.
LL.HI('John') => 'Hi John'
```

<!-- ------------------------------------------------------------------------------------------ -->

### typesafe arguments:

 > Syntax: `{key:type}`

```typescript
const translation = {
   HI: 'Hello {name:string}'
}

LL.HI('John')
// => ERROR: Argument of type 'string' is not assignable to parameter of type '{ name: string; }'.
LL.HI({ name: 'John' }) => 'Hi John'
```

#### everything together:

```typescript
const MESSAGE = 'Hi {name:string|uppercase}, I want to buy {nrOfApples:number} apple{{s}}'

LLL(MESSAGE, { name: 'John', nrOfApples: 42 }) => 'Hi JOHN, I would like to buy 42 apples'

```

### text only:

Of course langauge can handle that as well.

```typescript
LLL('Welcome to my site') => 'Welcome to my site'
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Usage

You can use langauge in a variety of project-setups:

 - [NodeJS](#nodeJS) apis, backends, scripts, ...
 - [Svelte](#svelte) applications
 - [Sapper](#sapper) projects
 - [SvelteKit](#sveltekit) projects
 - [Browser](#browser) projects
 - [other frameworks](#other) like React, VueJS, Angular and others ...

### General

The lanauge package exports a few different objects you can use to localize your applications:

 - [langaugeStringWrapper (LLL)](#langaugeStringWrapper)
 - [langaugeObjectWrapper (LL)](#langaugeObjectWrapper)
 - [langauge (L)](#langauge)

#### langaugeStringWrapper

The `langaugeStringWrapper` contains the core of the localization engine. To initialize it, you need to pass your desired `locale` and (optional) the `formatters` you want to use.\
You will get an object back (`LLL`) that can be used to transform your strings.

```typescript
import { langaugeStringWrapper } from 'langauge'

const locale = 'en'
const formatters = {
   uppercase: (value) => value.toUpperCase()
}

const LLL = langaugeStringWrapper(locale, formatters)

LLL('Hello {name|uppercase}!', { name: 'world' }) // => 'Hello WORLD!'
```

#### langaugeObjectWrapper

The `langaugeObjectWrapper` wraps your translations for a certain locale. To initialize it, you need to pass your desired `locale`, your `translations`-object and (optional) the `formatters` you want to use.\
You will get an object back (`LL`) that can be used to access and apply your translations.

```typescript
import { langaugeStringWrapper } from 'langauge'

const locale = 'en'
const translations = {
   HI: "Hello {name}!",
   RESET_PASSWORD: "reset password"
   ...
}
const formatters = { ... }

const LL = langaugeObjectWrapper(locale, translations, formatters)

LL.HI({ name: 'world' }) // => 'Hello world!'
LL.RESET_PASSWORD() // => 'reset password'
```

#### langauge

Wrap all your locales with `langauge`. To initialize it, you need to pass a callback to get the `translations`-object for a given locale and (optional) a callback to initialize the `formatters` you want to use.\
You will get an object back (`L`) that can be used to access all your locaLes and apply your translations.


```typescript
import { langaugeStringWrapper } from 'langauge'

const localeTranslations = {
   en: { TODAY: "Today is {date|weekday}" },
   de: { TODAY: "Heute ist {date|weekday}" },
   it: { TODAY: "Oggi è {date|weekday}" },
}

const loadLocale = (locale) => localeTranslations(locale)

const initFormatters = (locale) => {
   const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' })

   return {
      date: (value) => dateFormatter.format(value)
   }
}

const L = langauge(loadLocale, initFormatters)

const now = new Date()

L.en.TODAY() // => 'Today is friday'
L.de.TODAY() // => 'Heute ist Freitag'
L.it.TODAY() // => 'Oggi è venerdì'

```

A good usecase for this object could be inside your API, when your locale is dynamic e.g. derived from a users session:

```typescript
function doSomething(session) {

   ...

   const locale = session.language
   return L[locale].SUCCESS_MESSAGE()
}

```


### NodeJS

* **TypeScript**\
	When running the [watcher](#watcher) the file `langauge-util.ts` will export typesafe wrappers for the [langauge objects](#general). You can use them everywhere in your TypeScript files.

  ```typescript
  import { ... } from './langauge/langauge-util'
  ```

* **JavaScript**\
  Depending what you need, you can import any [function](#general) from the root `langauge` package.

  ```javascript
  import { ... } from 'langauge'
  ```

You can take a look at this [demo repository](https://github.com/ivanhofer/langauge-template-nodejs) to see how langauge will work in node projects.

### Svelte

* **TypeScript**\
	First, make sure you set the `svelte` [option](#options) to `true`.

	Svelte by default comes with a rollup-config. You could setup the watcher as [rollup-plugin](#rollup-plugin).

	The watcher will generate custom svelte stores inside `langauge-svelte.ts` that you can use inside your components.

* **JavaScript**\
	Since you can't take advantage of the generated types, you need to import the stores directly from 'langauge/svelte'.\
	When initializing you need to pass a callback to load the translation and an optional callback to initialize your formatters.

	```typescript
	import LL, { initLangauge } from 'langauge/svelte/svelte-store'

	const localeTranslations = {
	   en: { TODAY: "Today is {date|weekday}" },
	   de: { TODAY: "Heute ist {date|weekday}" },
	   it: { TODAY: "Oggi è {date|weekday}" },
	}

	const loadLocale = (locale) => localeTranslations(locale)

	const initFormatters = (locale) => {
	   const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' })

	   return {
	      date: (value) => dateFormatter.format(value)
	   }
	}

	initLangauge('en', loadLocale, initFormatters)

	$LL.TODAY(new Date()) // => 'Today is friday'
	```


The file exports following functions and readable stores:

#### initLangauge

You need to call initialize in order to setup all stores.

Call it inside your root svelte component:

```html
<script>
   import { initLangauge } from './langauge/langauge-svelte'

   initLangauge('en')
</script>
```

#### LL

The default export of the generated file will be the store you can use to translate your app. You can use it with subscriptions (`$LL`) or as a regular JavaScript object (`LL`).

```html
<script>
   import LL from './langauge/langauge-svelte'

   const showMessage = () => {
      alert(LL.SOME_MESSAGE())
   }
</script>

{$LL.HELLO({ name: 'world' })}

<button on:click={showMessage}>click me</button>
```


#### locale

This svelte store will contain the current selected locale.

```html
<script>
   import { locale } from './langauge/langauge-svelte'
</script>

<div>
   your language is: {$locale}
</div>
```

#### setLocale

If you want to change the locale, you need to call `setLocale` with the desited locale as argument.

```html
<script>
   import { setLocale } from './langauge/langauge-svelte'
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

#### localeLoading

Svelte store that returns a `boolean`. It can be used to wait for the locale to be loaded.

```html
<script>
   import { isLocaleLoading } from './langauge/langauge-svelte'
</script>

{#if $isLocaleLoading}
   loading...
{:else}

   <!-- your app code goes here  -->

{/if}
```

 <!-- TODO: create example repository -->

### Sapper

For your Sapper projects, you should call the `initLangauge` function inside `preload` in your root `routes/_layout.svelte` file:

```html
<script context="module">
   import { initLangauge } from '../langauge/langauge-svelte'

   export async function preload(page, session) {
      await initLangauge(session.locale)
   }
</script>
```

For more information about the stores you can use, see the [Svelte](#svelte) section.

 <!-- TODO: create example repository -->

### SvelteKit

I will update this part as soon as I get my hands on the beta and the syntax. But it will be more or less the same like described in the [Sapper](#sapper) and [Svelte](#svelte) sections.

 <!-- TODO: create example repository -->

### Browser

Load your desired function from the unpkg CDN and inject it into your HTML-code:

  - use [langaugeStringWrapper](#langaugeStringWrapper) (761 bytes gzipped)
	```html
  	<script src="https://unpkg.com/langauge/dist/langauge.string.min.js"></script>

	<script>
	   const LLL = langauge( /* langaugeStringWrapper parameters */ )

	   LLL('Hi {0}', 'John')
	</script>
  	```

  - use [langaugeObjectWrapper](#langaugeObjectWrapper) (817 bytes gzipped)
  	```html
  	<script src="https://unpkg.com/langauge/dist/langauge.object.min.js"></script>

	<script>
	   const LL = langauge( /* langaugeObjectWrapper parameters */ )

	   LL.HI('John')
	</script>
  	```

  - use [langauge](#langauge) (923 bytes gzipped)

	```html
  	<script src="https://unpkg.com/langauge/dist/langauge.instance.min.js"></script>

	<script>
	   const L = langauge( /* langauge parameters */ )

	   L.en.HI('John')
	</script>
  	```

  - all together (978 bytes gzipped)
  	```html
  	<script src="https://unpkg.com/langauge/dist/langauge.min.js"></script>

	<script>
	   const LLL = langauge.initStringWrapper( ... )
	   const LL = langauge.initObjectWrapper( ... )
	   const L = langauge.init( ... )
	</script>
  	```

### Other

All you need is inside the generated file `langauge-utils.ts`. You can use the functions in there to create a small wrapper for your application.\
Feel free to open an [issue](https://github.com/ivanhofer/langauge/issues), if you need a guide for a specific framework.

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Typesafety

The langauge package allows us to be 100% typesafe for our tranlsation functions and even the translations for other locales itself. It generates TypeScript definitions based on your base locale. It also generates some utility functions for easy usage.

In order to get get full typesafety for your locales, you can start the watcher during development. The watcher listens for changes you make to your [base locale file](#folder-structure) and generates the corresponding TypeScript types.

 > The watcher will generate a different output depending on your TypeScript version. Older versions don't support all the features langauge need to provide you with the best types. Make sure to use a TypeScript version `> 4.1.x` to benefit from all the typechecking features.

Currently you can choose between two variants to start the watcher:

### node-process

 > recommended, because it's faster than the rollup plugin

Start the watcher node process in your terminal:

```bash
> node ./node_modules/langauge/node/watcher.js
```

You can pass [options](#options) to the watcher by creating a `.langauge.json` file in the root of your workspace.

> You could use a npm-package like `npm-run-all` in order to start the watcher and you development-server in parallel.

You can take a look at this [demo repository](https://github.com/ivanhofer/langauge-template-nodejs) to see how to run the watcher node process.

### rollup-plugin

Add the `langaugeWatcher` to your `rollup.config.js`.

```typescript
import langaugeWatcher from 'langauge/rollup-plugin-langauge-watcher'

const isDev = !!process.env.ROLLUP_WATCH

export default {
   input: ...,
   output: ...,
   plugins: {
      ...
      typescript(),

      // only running in development mode
      // looks for changes in your base locale file
      isDev && langaugeWatcher({ /* options go here */ })
   }
}
```

> Make sure you start the watcher only in your development environment.

You can pass [options](#options) to the watcher by creating a `.langauge.json` file in the root of your workspace, or by passing it as an argument to `langaugeWatcher`.


 <!-- TODO: create example repository -->


### folder structure

This project requires you to use an opinionated folderstructure for your locales. By default all your files, you need for localizations live insed your `src/langauge` folder (you can [configure](#options) this).

When running the watcher for the first time, a few files will be generated:

```
src/
   langauge/
      en/
         index.ts
      formatters.ts
      langauge-types.ts
      langauge-util.ts
      custom-types.ts
```

 > Some files are auto-generated, please don't make manual changes to them, since they will be overwritten.

 - `en/index.ts`\
  	If 'en' is your [base locale](#baselocale), the file `src/langauge/en/index.ts` will contain your translations. Whenever you make changes to this file, the watcher will generate updated type definitions.

 - `formatters.ts`\
	In this file, you can configure the [formatters](#formatters) to use inside your translations.

 - `langauge-types.ts`\
	Type definitions are generated in this file. You don't have to understand them. They are just here to help TypeScript understand, how you need to call the translation functions.

 - `langauge-util.ts`\
   This file contains some wrappers around the [base langauge functions](#general).

 - `custom-types.ts`\
	For [definig types](#custom-types) that are unknown to langauge.


#### locales

Locales must follow a specific file pattern. For each locale, you have to create a folder with the name of the locale inside your `src/langauge` folder e.g. 'en', 'en-us', 'en-GB'. The name of the folder is also the name of the locale you use inside your code. Each locales folder needs to have an `index.ts` file with a default export. The file should export an object with key-values pairs and should look something like:

```javascript
import type { LangaugeTranslation } from '../langauge-types';

const de: LangaugeTranslation = {

   ... // your translations go here

}

export default de
```
 > make shure to give it the type of `LangaugeTranslation`, to get compile-errors, when some translations are missing

#### formatters

You can specify your own formatters, that take an argument as an input and return a another value.

```typescript
const formatters = {
   roiCalculator: (value) => {
      return (value * 4.2) - 7
   }
}

LLL('Invest ${0} and get ${0|roiCalculator} in return', 100)
// => 'Invest $100 and get $413 in return'
```

You can also use a few builtin formatters:

 - date\
   A wrapper for [Intl.DateTimeFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
	```typescript
	import { date } from 'langauge/formatters'

	const formatters = {
	   weekday: date({ weekday: 'long' })
	}

	LLL('Today is {0|weekday}', new Date()) // => 'Today is friday'
	```
 - time\
  	A wrapper for [Intl.DateTimeFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
	```typescript
	import { time } from 'langauge/formatters'

	const formatters = {
	   timeShort: time('en', { timeStyle: 'short' })
	}

	LLL('Next meeting: {0|timeShort}', meetingTime) // => 'Next meeting: 8:00 AM'
	```
 - number\
  	A wrapper for [Intl.NumberFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
	```typescript
	import { number } from 'langauge/formatters'

	const formatters = {
	   currency: number('en', { style: 'currency', currency: 'EUR' })
	}

	LLL('your balance is {0|currency}', 12345) // => 'your balance is €12,345.00'
	```
 - replace
	A wrapper for [String.prototype.replace](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
	```typescript
	import { replace } from 'langauge/formatters'

	const formatters = {
	   noSpaces: replace(' ', '-')
	}

	LLL('The link is: https://www.xyz.com/{0|noSpaces}', 'super cool product')
	// => 'The link is: https://www.xyz.com/super-cool-product'

	```
 - uppercase\
 	A wrapper for [String.prototype.toUpperCase](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
	```typescript
	import { uppercase } from 'langauge/formatters'

	const formatters = {
	   upper: uppercase
	}

	LLL('I sayed: {0|upper}', 'hello') // => 'I sayed: HELLO'
	```
 - lowercase\
  	A wrapper for [String.prototype.toLowerCase](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
	```typescript
	import { lowercase } from 'langauge/formatters'

	const formatters = {
	   lower: lowercase
	}

	LLL('He sayed: {0|lower}', 'SOMETHING') // => 'He sayed: something'
	```

#### custom types

If you want to pass arguments with your own types to the translation function, you need to tell langauge how these types look like. In order to do this, you need to create an export with the exact name of tht type inside this file.

If you have a translation with e.g. the type `Sum`,

```javascript
const translations: LangaugeBaseTranslation = {
   RESULT: 'The result is: {0:Sum|calculate}'
}
```

you need to export `Sum` as a type in your `custom-types.ts` file

```javascript
export type Sum = {
   n1: number
   n2: number
   n2: number
}
```

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Options

You can set options for the [watcher](#typesafety) in order to get optimized output for your specific project. The available options are:

| key                                                       | type                    | default value                            |
| --------------------------------------------------------- | ----------------------- | ---------------------------------------- |
| [baseLocale](#baseLocale)                                 | `string`                | `'en'`                                   |
| [locales](#locales)                                       | `string[]`              | `[]`                                     |
| [lazyLoad](#lazyLoad)                                     | `boolean`               | `true`                                   |
| [svelte](#svelte)                                         | `boolean &#124; string` | `false`                                  |
| [outputPath](#outputPath)                                 | `string`                | `'./src/langauge/'`                      |
| [typesFileName](#typesFileName)                           | `string`                | `'langauge-types'`                       |
| [utilFileName](#utilFileName)                             | `string`                | `'langauge-util'`                        |
| [formattersTemplateFileName](#formattersTemplateFileName) | `string`                | `'formatters'`                           |
| [typesTemplateFileName](#typesTemplateFileName)           | `string`                | `'custom-types'`                         |
| [tempPath](#tempPath)                                     | `string`                | `'./node_modules/langauge/temp-output/'` |


### baseLocale

Defines which locale to use for the types generation. You can find more information on how to structure your locales [here](#folder-structure).

### locales

Specifies the locales you want to use. If you want to only include certain locales, you need to pass only the localess you want to use. If empty, it will use all locales.

### lazyLoad

Whether to generate code that loads the locales asynchronously. If set to `true`, a locale will be loaded, when you first access it. If set to `false` all locales will be loaded when you init the langauge-object.

### svelte

If set to  `true`, generates code that wraps the langauge object into a svelte store to use inside your Svelte, Sapper or SvelteKit applications. If set to a `string` value, it uses that value for the name of the generated file. The default filename is `langauge-svelte`.

### outputPath

Folder in which the files should be generated and where the watcher should look for your locale files.

### typesFileName

Name for the file where the types for your locales are generated.

### utilFileName

Name for the file where the typesafe langauge-objects are generated.

### formattersTemplateFileName

Name for the file where you can configure your formatters.

### typesTemplateFileName

Name for the file where you can configure your custom-types.

### tempPath

Folder where the watcher can store temporary files. These files are generated when your baseLocale is analyzed and the types are generated. The folder will be cleared, after the types were generated, so make sure you use an empty folder, if you change this option.

<!-- TODO: create an FAQ section -->