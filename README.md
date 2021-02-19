An opinionated, full type-safe, lightweight localization library for TypeScript projects with no external dependencies.

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
This package consists of a [translation-function](#i18nString), as well as an [generator](#typesafety) for TypeScript code. By looking at your base translation, it can output type definitions, to make your (developer-)life easier.

 > The package can be used inside JavaScript and TypeScript applications, but you will get a lot of benefits using it together with TypeScript, since the [watcher](#typesafety) will generate a few wrappers for easier usage.

<!-- TODO: make a gif demonstrating typesafe-i18n -->

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Installation

```
$ npm install --save typesafe-i18n
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

Under the hood, `typesafe-i18n` uses the [Intl.PluralRules](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) for detecting the plural form.

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

Of course `typesafe-i18n` can handle that as well.

```typescript
LLL('Welcome to my site') => 'Welcome to my site'
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Usage

You can use `typesafe-i18n` in a variety of project-setups:

 - [NodeJS](#nodeJS) apis, backends, scripts, ...
 - [Svelte](#svelte) applications
 - [Sapper](#sapper) projects
 - [SvelteKit](#sveltekit) projects
<!-- TODO: create example for react -->
 - [Browser](#browser) projects
 - [other frameworks](#other) like React, VueJS, Angular and others ...

### General

The lanauge package exports a few different objects you can use to localize your applications:

 - [i18nString (LLL)](#i18nString)
 - [i18nObject (LL)](#i18nObject)
 - [i18n (L)](#i18n)

#### i18nString

The `i18nString` contains the core of the localization engine. To initialize it, you need to pass your desired `locale` and (optional) the `formatters` you want to use.\
You will get an object back (`LLL`) that can be used to transform your strings.

```typescript
import { i18nString } from 'typesafe-i18n'

const locale = 'en'
const formatters = {
   uppercase: (value) => value.toUpperCase()
}

const LLL = i18nString(locale, formatters)

LLL('Hello {name|uppercase}!', { name: 'world' }) // => 'Hello WORLD!'
```

#### i18nObject

The `i18nObject` wraps your translations for a certain locale. To initialize it, you need to pass your desired `locale`, your `translations`-object and (optional) the `formatters` you want to use.\
You will get an object back (`LL`) that can be used to access and apply your translations.

```typescript
import { i18nObject } from 'typesafe-i18n'

const locale = 'en'
const translations = {
   HI: "Hello {name}!",
   RESET_PASSWORD: "reset password"
   ...
}
const formatters = { ... }

const LL = i18nObject(locale, translations, formatters)

LL.HI({ name: 'world' }) // => 'Hello world!'
LL.RESET_PASSWORD() // => 'reset password'
```

#### i18n

Wrap all your locales with `i18n`. To initialize it, you need to pass a callback to get the `translations`-object for a given locale and (optional) a callback to initialize the `formatters` you want to use.\
You will get an object back (`L`) that can be used to access all your locaLes and apply your translations.


```typescript
import { i18n } from 'typesafe-i18n'

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

const L = i18n(loadLocale, initFormatters)

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
	When running the [watcher](#watcher) the file `i18n-util.ts` will export typesafe wrappers for the [i18n functions](#general). You can use them everywhere in your TypeScript files.

  ```typescript
  import { ... } from './i18n/i18n-util'
  ```

* **JavaScript**\
  Depending what you need, you can import any [function](#general) from the root `typesafe-i18n` package.

  ```javascript
  import { ... } from 'typesafe-i18n'
  ```

<!-- You can take a look at this [demo repository](https://github.com/ivanhofer/typesafe-i18n-template-nodejs) to see how `typesafe-i18n` will work in node projects. -->

### Svelte

* **TypeScript**\
	First, make sure you set the `adapter` [option](#options) to `svelte`.

	Svelte by default comes with a rollup-config. You could setup the watcher as [rollup-plugin](#rollup-plugin).

	The watcher will generate custom svelte stores inside `i18n-svelte.ts` that you can use inside your components.

* **JavaScript**\
	Since you can't take advantage of the generated types, you need to import the stores directly from 'i18n/svelte'.\
	When initializing you need to pass a callback to load the translation and an optional callback to initialize your formatters.

	```typescript
	import LL, { initI18n } from 'typesafe-i18n/svelte/svelte-store'

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

	initiI8n('en', loadLocale, initFormatters)

	$LL.TODAY(new Date()) // => 'Today is friday'
	```


The file exports following functions and readable stores:

#### initI18n

You need to call initialize in order to setup all stores.

Call it inside your root svelte component:

```html
<script>
   import { initI18n } from './i18n/i18n-svelte'

   initI18n('en')
</script>
```

#### LL

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


#### locale

This svelte store will contain the current selected locale.

```html
<script>
   import { locale } from './i18n/i18n-svelte'
</script>

<div>
   your language is: {$locale}
</div>
```

#### setLocale

If you want to change the locale, you need to call `setLocale` with the desited locale as argument.

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

#### localeLoading

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

 <!-- TODO: create example repository -->

### Sapper

For your Sapper projects, you should call the `initI18n` function inside `preload` in your root `routes/_layout.svelte` file:

```html
<script context="module">
   import { initI18n } from '../i18n/i18n-svelte'

   export async function preload(page, session) {
      await initI18n(session.locale)
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

  - use [i18nString](#i18nString) (779 bytes gzipped)
	```html
  	<script src="https://unpkg.com/typesafe-i18n/dist/i18n.string.min.js"></script>

	<script>
	   const LLL = i18n( /* i18nString parameters */ )

	   LLL('Hi {0}', 'John')
	</script>
  	```

  - use [i18nObject](#i18nObject) (836 bytes gzipped)
  	```html
  	<script src="https://unpkg.com/typesafe-i18n/dist/i18n.object.min.js"></script>

	<script>
	   const LL = i18n( /* i18nObject parameters */ )

	   LL.HI('John')
	</script>
  	```

  - use [i18n](#i18n) (941 bytes gzipped)

	```html
  	<script src="https://unpkg.com/typesafe-i18n/dist/i18n.min.js"></script>

	<script>
	   const L = i18n( /* i18n parameters */ )

	   L.en.HI('John')
	</script>
  	```

  - all together (996 bytes gzipped)
  	```html
  	<script src="https://unpkg.com/typesafe-i18n/dist/i18n.all.min.js"></script>

	<script>
	   const LLL = i18n.initString( ... )
	   const LL = i18n.initObject( ... )
	   const L = i18n.init( ... )
	</script>
  	```

### Other

All you need is inside the generated file `i18n-utils.ts`. You can use the functions in there to create a small wrapper for your application.\
Feel free to open an [issue](https://github.com/ivanhofer/typesafe-i18n/issues), if you need a guide for a specific framework.

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Typesafety

The `typesafe-i18n` package allows us to be 100% typesafe for our tranlsation functions and even the translations for other locales itself. It generates TypeScript definitions based on your base locale. It also generates some utility functions for easy usage.

In order to get get full typesafety for your locales, you can start the watcher during development. The watcher listens for changes you make to your [base locale file](#folder-structure) and generates the corresponding TypeScript types.

 > The watcher will generate a different output depending on your TypeScript version. Older versions don't support all the features `typesafe-i18n` need to provide you with the best types. Make sure to use a TypeScript version `> 4.1.x` to benefit from all the typechecking features.

Currently you can choose between two variants to start the watcher:

### node-process

 > recommended, because it's faster than the rollup plugin

Start the watcher node process in your terminal:

```bash
> node ./node_modules/typesafe-i18n/node/watcher.js
```

You can pass [options](#options) to the watcher by creating a `.typesafe-i18n.json` file in the root of your workspace.

> You could use a npm-package like `npm-run-all` in order to start the watcher and you development-server in parallel.

You can take a look at this [demo repository](https://github.com/ivanhofer/typesafe-i18n-template-nodejs) to see how to run the watcher node process.

### rollup-plugin

Add the `i18nWatcher` to your `rollup.config.js`.

```typescript
import i18nWatcher from 'typesafe-i18n/rollup/rollup-plugin-typesafe-i18n-watcher'

const isDev = !!process.env.ROLLUP_WATCH

export default {
   input: ...,
   output: ...,
   plugins: {
      ...
      typescript(),

      // only running in development mode
      // looks for changes in your base locale file
      isDev && i18nWatcher({ /* options go here */ })
   }
}
```

> Make sure you start the watcher only in your development environment.

You can pass [options](#options) to the watcher by creating a `.typesafe-i18n.json` file in the root of your workspace, or by passing it as an argument to `i18nWatcher`.


 <!-- TODO: create example repository -->


### folder structure

This project requires you to use an opinionated folderstructure for your locales. By default all your files, you need for localizations live insed your `src/i18n` folder (you can [configure](#options) this).

When running the watcher for the first time, a few files will be generated:

```
src/
   i18n/
      en/
         index.ts
      formatters.ts
      i18n-types.ts
      i18n-util.ts
      custom-types.ts
```

 > Some files are auto-generated, please don't make manual changes to them, since they will be overwritten.

 - `en/index.ts`\
  	If 'en' is your [base locale](#baselocale), the file `src/i18n/en/index.ts` will contain your translations. Whenever you make changes to this file, the watcher will generate updated type definitions.

 - `formatters.ts`\
	In this file, you can configure the [formatters](#formatters) to use inside your translations.

 - `i18n-types.ts`\
	Type definitions are generated in this file. You don't have to understand them. They are just here to help TypeScript understand, how you need to call the translation functions.

 - `i18n-util.ts`\
   This file contains some wrappers around the [base i18n functions](#general).

 - `custom-types.ts`\
	For [definig types](#custom-types) that are unknown to `typesafe-i18n`.


#### locales

Locales must follow a specific file pattern. For each locale, you have to create a folder with the name of the locale inside your `src/i18n` folder e.g. 'en', 'en-us', 'en-GB'. The name of the folder is also the name of the locale you use inside your code. Each locales folder needs to have an `index.ts` file with a default export. The file should export an object with key-values pairs and should look something like:

```javascript
import type { Translation } from '../i18n-types';

const de: Translation = {

   ... // your translations go here

}

export default de
```
 > make sure to give it the type of `Translation`, to get compile-errors, when some translations are missing

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

<!-- TODO: create examples for date-fns or other common formatters -->

You can also use a few builtin formatters:

 - date\
   A wrapper for [Intl.DateTimeFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
	```typescript
	import { date } from 'typesafe-i18n/formatters'

	const formatters = {
	   weekday: date({ weekday: 'long' })
	}

	LLL('Today is {0|weekday}', new Date()) // => 'Today is friday'
	```
 - time\
  	A wrapper for [Intl.DateTimeFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
	```typescript
	import { time } from 'typesafe-i18n/formatters'

	const formatters = {
	   timeShort: time('en', { timeStyle: 'short' })
	}

	LLL('Next meeting: {0|timeShort}', meetingTime) // => 'Next meeting: 8:00 AM'
	```
 - number\
  	A wrapper for [Intl.NumberFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
	```typescript
	import { number } from 'tyoesafe-i18n/formatters'

	const formatters = {
	   currency: number('en', { style: 'currency', currency: 'EUR' })
	}

	LLL('your balance is {0|currency}', 12345) // => 'your balance is €12,345.00'
	```
 - replace
	A wrapper for [String.prototype.replace](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
	```typescript
	import { replace } from 'typesafe-i18n/formatters'

	const formatters = {
	   noSpaces: replace(' ', '-')
	}

	LLL('The link is: https://www.xyz.com/{0|noSpaces}', 'super cool product')
	// => 'The link is: https://www.xyz.com/super-cool-product'

	```
 - uppercase\
 	A wrapper for [String.prototype.toUpperCase](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
	```typescript
	import { uppercase } from 'typesafe-i18n/formatters'

	const formatters = {
	   upper: uppercase
	}

	LLL('I sayed: {0|upper}', 'hello') // => 'I sayed: HELLO'
	```
 - lowercase\
  	A wrapper for [String.prototype.toLowerCase](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
	```typescript
	import { lowercase } from 'typesafe-i18n/formatters'

	const formatters = {
	   lower: lowercase
	}

	LLL('He sayed: {0|lower}', 'SOMETHING') // => 'He sayed: something'
	```

#### custom types

If you want to pass arguments with your own types to the translation function, you need to tell `typesafe-i18n` how these types look like. In order to do this, you need to create an export with the exact name of that type inside this file.

If you have a translation with e.g. the type `Sum`,

```javascript
const translations: BaseTranslation = {
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

| key                                                       | type                                          | default value                                 |
| --------------------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| [baseLocale](#baseLocale)                                 | `string`                                      | `'en'`                                        |
| [locales](#locales)                                       | `string[]`                                    | `[]`                                          |
| [loadLocalesAsync](#loadLocalesAsync)                     | `boolean`                                     | `true`                                        |
| [adapter](#adapter)                                       | `'node'` &#124; `'svelte'` &#124; `undefined` | `undefined`                                   |
| [outputPath](#outputPath)                                 | `string`                                      | `'./src/i18n/'`                               |
| [typesFileName](#typesFileName)                           | `string`                                      | `'i18n-types'`                                |
| [utilFileName](#utilFileName)                             | `string`                                      | `'i18n-util'`                                 |
| [formattersTemplateFileName](#formattersTemplateFileName) | `string`                                      | `'formatters'`                                |
| [typesTemplateFileName](#typesTemplateFileName)           | `string`                                      | `'custom-types'`                              |
| [adapterFileName](#adapterFileName)                       | `string` &#124; `undefined`                   | `undefined`                                   |
| [tempPath](#tempPath)                                     | `string`                                      | `'./node_modules/typesafe-i18n/temp-output/'` |


### baseLocale

Defines which locale to use for the types generation. You can find more information on how to structure your locales [here](#folder-structure).

### locales

Specifies the locales you want to use. If you want to only include certain locales, you need to pass only the localess you want to use. If empty, it will use all locales.

### loadLocalesAsync

Whether to generate code that loads the locales asynchronously. If set to `true`, a locale will be loaded, when you first access it. If set to `false` all locales will be loaded when you init the i18n-functions.

### adapter

If config is set, code will be generated that wraps i18n functions into useful helpers for that environment e.g. a `svelte`-store.

### outputPath

Folder in which the files should be generated and where the watcher should look for your locale files.

### typesFileName

Name for the file where the types for your locales are generated.

### utilFileName

Name for the file where the typesafe i18n-functions are generated.

### formattersTemplateFileName

Name for the file where you can configure your formatters.

### typesTemplateFileName

Name for the file where you can configure your custom-types.

### adapterFileName

Name for the file when generating output for an adapter. The default filename is `i18n-[adapter]`.

### tempPath

Folder where the watcher can store temporary files. These files are generated when your baseLocale is analyzed and the types are generated. The folder will be cleared, after the types were generated, so make sure you use an empty folder, if you change this option.

<!-- TODO: create an FAQ section -->