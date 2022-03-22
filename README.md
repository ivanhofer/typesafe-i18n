# :earth_africa: typesafe-i18n

**An opinionated, fully type-safe, lightweight localization library for TypeScript and JavaScript projects with no external dependencies.**

<img src="https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/typesafe-i18n-demo.gif" width="100%">

[![npm version](https://badgen.net/npm/v/typesafe-i18n)](https://badgen.net/npm/v/typesafe-i18n)
[![types included](https://badgen.net/npm/types/typesafe-i18n)](https://badgen.net/npm/types/typesafe-i18n)
[![bundle size](https://badgen.net/bundlephobia/minzip/typesafe-i18n)](https://badgen.net/bundlephobia/minzip/typesafe-i18n)
[![bump version & publish to npm](https://github.com/ivanhofer/typesafe-i18n/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/ivanhofer/typesafe-i18n/actions/workflows/release.yml)
[![Generic badge](https://img.shields.io/badge/discord-support-slateblue.svg)](https://discord.gg/T27AHfaADK)


## Advantages

:baby_chick: [lightweight](#sizes) (~1kb)\
:ok_hand: [easy to use syntax](#syntax)\
:running: [fast and efficient](#performance)\
:safety_vest: [prevents you from making mistakes](#typesafety) (also in [plain JavaScript projects](#jsdoc))\
:construction_worker: [creates boilerplate code](#folder-structure) for you\
:speech_balloon: [supports plural rules](#plural)\
:date: allows [formatting of values](#formatters) e.g. locale-dependent date or number formats\
:left_right_arrow: supports [switch-case statements](#switch-case) e.g. for gender-specific output\
:arrow_down: option for [asynchronous loading of locales](#asynchronous-loading-of-locales)\
:books: supports multiple [namespaces](#namespaces)\
:stopwatch: supports SSR (Server-Side Rendering)\
:handshake: can be used for [frontend, backend and API](#usage) projects\
:mag: [locale-detection](#locale-detection) for browser and server environments\
:arrows_counterclockwise: [import](#importer) and [export](#exporter) translations from/to files or services\
:no_entry: no external dependencies

<!-- list of supported emojis on GitHub: https://github.com/ikatyang/emoji-cheat-sheet -->

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Table of Contents

- [**Get started**](#get-started) - how to add `typesafe-i18n` to your project
- [**Usage**](#usage) - how to implement different use-cases
- [**Typesafety**](#typesafety) - how to get the best typesafety features
- [**Syntax**](#syntax) - how to use the translation functions
- [**Dictionary**](#dictionary) - how to structure your translations
- [**Namespaces**](#namespaces) - how to optimize loading of your translations
- [**Formatters**](#formatters) - how to format dates and numbers
- [**Switch-Case**](#switch-case) - how to output different words depending on an argument
- [**Locale-detection**](#locale-detection) - how to detect an user's locale
- [**Integrations**](#integration-with-other-services) - how to integrate other i18n services
- [**Sizes**](#sizes) - how much does `typesafe-i18n` add to your bundle size
- [**Performance**](#performance) - how efficient is `typesafe-i18n` implemented
- [**FAQs**](#faqs) - how to get your questions answered


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Get started

1. Run the setup process and **automatically detect** the config needed
   ```bash
   npx typesafe-i18n --setup-auto
   ```
   or **manually configure** `typesafe-i18n` by answering a few questions
   ```bash
   npx typesafe-i18n --setup
   ```
   > It didn't work? See [here](#installing-typesafe-i18n-fails) for possible troubleshooting.

2. :eyes: Take a look at the generated files and it's [folder-structure](#folder-structure)

3. :open_book: Explore the docs
   > `typesafe-i18n` offers a lot. Just press `cmd + F` to search on this page.

4. :star: Star this project on [GitHub](https://github.com/ivanhofer/typesafe-i18n)
   > Thanks! This helps the project to grow.

\
*Having trouble setting up `typesafe-i18n`? Reach out to us via [Github Discussions](https://github.com/ivanhofer/typesafe-i18n/discussions) or on [Discord](https://discord.gg/T27AHfaADK).*


### manual installation

```bash
npm install typesafe-i18n
```

### changelog

The changelog can be found [here](https://github.com/ivanhofer/typesafe-i18n/blob/main/CHANGELOG.md)

#### migrations

 - to version `4.x.x`: see the [`release post`](https://github.com/ivanhofer/typesafe-i18n/discussions/169)
 - to version `3.x.x`: see the [`release post`](https://github.com/ivanhofer/typesafe-i18n/discussions/163)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Usage

> The package can be used inside JavaScript and TypeScript applications. You will get a lot of benefits by running the [generator](#typesafety) since it will create a few wrappers to provide you with full typesafety.

You can use `typesafe-i18n` in a variety of project-setups:

 - [Angular](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/angular) applications
 - [Browser (Vanilla JS)](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/browser) projects
 - [Node.js](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/node) apis, backends, scripts, ...
 - [React / Next.js](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/react) applications
 - [Svelte](https://github.com/ivanhofer/typesafe-i18n-demo-svelte) / [SvelteKit](https://github.com/ivanhofer/typesafe-i18n-demo-sveltekit) / [Sapper](https://github.com/ivanhofer/typesafe-i18n-demo-svelte) applications
 - [Vue.js](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/vue) applications
 - [other frameworks](#other-frameworks)


### Browser Support

The library should work in all **modern browsers**. It uses some functionality from the [`Intl` namespace](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl). You can see the list of supported browsers [here](https://caniuse.com/intl-pluralrules). If you want to support older browsers that don't include these functions, you would need to include a polyfill like [intl-pluralrules](https://formatjs.io/docs/polyfills/intl-pluralrules/).


### Other frameworks

All you need is inside the [generated](#typesafety) file `i18n-utils.ts`. You can use the functions in there to create a small wrapper for your application.

> Feel free to open a new [discussion](https://github.com/ivanhofer/typesafe-i18n/discussions) if you need a guide for a specific framework.


### Custom usage

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/runtime)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Typesafety

The `typesafe-i18n` package allows us to be 100% typesafe for our translation functions and even the translations for other locales itself. The generator outputs TypeScript definitions based on your base locale. Here you can see some examples where the generated types can help you:

#### typesafe auto-completion for all your defined locales
![typesafe locales completion](https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/01_typesafe-locales-completion.png)

#### typesafe auto-completion for all available translations
![typesafe translation key completion](https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/02_typesafe-key-completion.png)

#### you will get an error if you forget to pass arguments
![typesafe number of arguments](https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/03_typesafe-nr-of-arguments.png)

#### you will get an error if you pass the wrong type arguments
![typesafe arguments 1](https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/04_typesafe-arguments.png)
![typesafe arguments 2](https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/04_typesafe-arguments-2.png)

#### you will get an error if you forgot to add a translation in a locale
![typesafe keys in translations](https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/05_typesafe-keys-in-translations.png)

#### you will get an error when a translation is missing an argument
![typesafe arguments in translation](https://raw.githubusercontent.com/ivanhofer/typesafe-i18n/main/docs/06_typesafe-arguments-in-translation.png)


In order to get get full typesafety for your locales, you can start the generator during development. The generator listens for changes you make to your [base locale file](#dictionary) and creates the corresponding TypeScript types.

> You will also benefit from full typesafe JavaScript code via [JSDoc-annotations](#jsdoc).

Make sure you have installed `node` version `> 12.x` and are using a `typescript` version `>= 3.5.1`.

 > The generator will create a different output depending on your TypeScript version. Older versions don't support all the features `typesafe-i18n` need to provide you with the best types. Make sure to use a TypeScript version `> 4.1.x` to benefit from all the typechecking features.

### node-process

Start the generator node process in your terminal:

```bash
> npx typesafe-i18n
```

or define a script in your `package.json` file:

```json
{
   "scripts": {
      "typesafe-i18n": "typesafe-i18n"
   }
}
```
> You could use a npm-package like [`npm-run-all`](https://github.com/mysticatea/npm-run-all/blob/master/docs/npm-run-all.md#run-scripts-in-parallel) in order to start the generator and you development-server in parallel.

To start the generator and watch for changes in your translation you can run:

```bash
> npm run typesafe-i18n
```

Passing [options](#options) to the generator is possible by creating a `.typesafe-i18n.json` file in the root of your workspace.

#### running the generator in CI/CD

When running tests or scripts you can disable the watcher by passing the argument `--no-watch` to the generator node-process:

```bash
> npx typesafe-i18n --no-watch
```

This will only generate types once and **not** listen to changes in your locale files. The process will throw an `TypesafeI18nParseError` if a wrong syntax is detected in your [base locale file](#dictionary).

### folder structure

This project requires you to use an opinionated folder structure for your locales. All your localization files are located inside the `src/i18n` folder.

When running the generator for the first time, a few files will be created:

```
src/
   i18n/
      en/
         index.ts
      custom-types.ts
      formatters.ts
      i18n-types.ts
      i18n-util.async.ts
      i18n-util.sync.ts
      i18n-util.ts
```

 > Some files are auto-generated on every change of your [base locale file](#dictionary); please don't make manual changes to them, since they will be overwritten.

 - `en/index.ts`\
  	If 'en' is your [base locale](#baselocale), the file `src/i18n/en/index.ts` will contain your translations. Whenever you make changes to this file, the generator will create updated type definitions.

 - `custom-types.ts`\
	To [defining types](#custom-types) that are unknown to `typesafe-i18n`.

 - `formatters.ts`\
	In this file, you can configure the [formatters](#formatters) to use inside your translations.

 - `i18n-types.ts`\
	Type definitions are generated in this file. You don't have to understand them. They are just here to help TypeScript understand, how you need to call the translation functions.

 - `i18n-util.async.ts`\
   This file contains the logic to load individual locales asynchronously.

 - `i18n-util.ts`\
   This file contains the logic to load your locales in a synchronous way.

 - `i18n-util.ts`\
   This file contains wrappers with type-information around the [base i18n functions](#custom-usage).


### loading locales

You can choose how you want to load locales depending on your application use-case
 - [asynchronously](#asynchronous-loading-of-locales): load each locale as a separate network request *(recommended)*
 - [synchronous](#synchronous-loading-of-locales): load all locales at once

#### asynchronous loading of locales

If your app gets loaded via a network request (probably most websites and -applications) you should use the `loadLocaleAsync` function provided by `src/i18n/i18n-util.async.ts`. It only loads the locale that is currently needed to render the page. No unnecessary data from other locales is transferred to your users. The function returns a `Promise` that loads the dictionary and initializes your [`formatters`](#formatters).

```ts
import { loadLocaleAsync } from './i18n/i18n-util.async'
import { i18nObject } from './i18n/i18n-util'

let LL

const switchLocale = async (locale) => {
   await loadLocaleAsync(locale)
   LL = i18nObject(locale)
}
```

#### synchronous loading of locales

If you are using `typesafe-i18n` in a server or API context, you can load all locales when the app starts by using the `loadAllLocales` function provided by `src/i18n/i18n-util.sync.ts`. The function loads all dictionaries and initializes the [`formatters`](#formatters) for each locale.

```ts
import { loadAllLocales } from './i18n/i18n-util.sync'
import { i18n } from './i18n/i18n-util'

const locale = 'en'

loadAllLocales(locale)

const L = i18n(locale)
```


### locales

Locales must follow a specific file pattern. For each locale, you have to create a folder with the name of the locale inside your `src/i18n` folder e.g. 'en', 'en-us', 'en-GB'. The name of the folder is also the name of the locale you use inside your code. Each locales folder needs to have an `index.ts` file with a default export. The file should export an object with key-values pairs or arrays and should look something like:

```typescript
import type { Translation } from '../i18n-types';

const de: Translation = {

   /* your translations go here */

}

export default de
```
 > make sure to give it the type of `Translation` to get compile-errors, when some translations are missing

### custom types

If you want to pass arguments with your own types to the translation function, you need to tell `typesafe-i18n` how these types look like. In order to do this, you need to create an export with the exact name of that type inside this file.

If you have a translation with e.g. the type `Sum`,

```typescript
const translations: BaseTranslation = {
   RESULT: 'The result is: {0:Sum|calculate}'
}
```

you need to export `Sum` as a type in your `custom-types.ts` file

```typescript
export type Sum = {
   n1: number
   n2: number
   n2: number
}
```

### Options

You can set options for the [generator](#typesafety) inside a `.typesafe-i18n.json`-file in your project's root folder e.g.

```json
{
   "$schema": "https://unpkg.com/typesafe-i18n@3.0.0/schema/typesafe-i18n.json",

   "baseLocale": "de",
   "adapter": "svelte"
}
```

> if you add the `$schema` inside your config, you will get hints and auto-completion suggestions inside your IDE. Just make sure the link points to the version you are currently using.

The available options are:

| key                                                       | type                                                                                             | default value                                 |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| [adapter](#adapter)                                       | `'angular'` &#124; `'node'` &#124; `'react'` &#124; `'svelte'` &#124; `'vue'` &#124; `undefined` | `undefined`                                   |
| [baseLocale](#baseLocale)                                 | `string`                                                                                         | `'en'`                                        |
| [outputFormat](#outputFormat)                             | `'TypeScript'` &#124; `'JavaScript'`                                                             | `'TypeScript'`                                |
| [esmImports](#esmImports)                                 | `boolean`                                                                                        | `false`                                       |
| [generateOnlyTypes](#generateOnlyTypes)                   | `boolean`                                                                                        | `false`                                       |
| [runAfterGenerator](#runAfterGenerator)                   | `string` &#124; `undefined`                                                                      | `undefined`                                   |
| [banner](#banner)                                         | `string`                                                                                         | `'/* eslint-disable */'`                      |
| [outputPath](#outputPath)                                 | `string`                                                                                         | `'./src/i18n/'`                               |
| [typesFileName](#typesFileName)                           | `string`                                                                                         | `'i18n-types'`                                |
| [utilFileName](#utilFileName)                             | `string`                                                                                         | `'i18n-util'`                                 |
| [formattersTemplateFileName](#formattersTemplateFileName) | `string`                                                                                         | `'formatters'`                                |
| [typesTemplateFileName](#typesTemplateFileName)           | `string`                                                                                         | `'custom-types'`                              |
| [adapterFileName](#adapterFileName)                       | `string` &#124; `undefined`                                                                      | `undefined`                                   |
| [tempPath](#tempPath)                                     | `string`                                                                                         | `'./node_modules/typesafe-i18n/temp-output/'` |


#### `adapter`

If this config is set, code will be generated that wraps i18n functions into useful helpers for that environment e.g. a `svelte`-store.

#### `baseLocale`

Defines which locale to use for the types generation. You can find more information on how to structure your locales [here](#locales).

#### `outputFormat`

The programming language you use inside your code. If 'TypeScript' is selected, the generator will output TypeScript code and types. If you choose 'JavaScript' the generator will output typesafe JavaScript code annotated with [JSDoc-comments](#jsdoc).

#### `esmImports`

If `true` generated files will import other files with the `.js` file extension. This makes it compatible with ESM packages that have specified `"type": "module"` in their `package.json` file.

#### `generateOnlyTypes`

If you don't want to use the auto-generated helpers and instead write your own wrappers, you can set this option to `true`.

#### `runAfterGenerator`

This hook allows you to e.g. run a code formatting/linting command after the generator completes. When a command is provided, a [`child_process`](https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback) gets spawned with that command e.g. `npm run prettier --write "src/i18n"`

#### `banner`

This text will be output on top of all auto-generated files. It is meant to add a custom disable-linter comment. Since every project can have different lint rules, we want to disable linting on those files.

#### `outputPath`

Folder in which the files should be generated and where your locale files are located.

#### `typesFileName`

Name for the file where the types for your locales are generated.

#### `utilFileName`

Name for the file where the typesafe i18n-functions are generated.

#### `formattersTemplateFileName`

Name for the file where you can configure your formatters.

#### `typesTemplateFileName`

Name for the file where you can configure your custom-types.

#### `adapterFileName`

Name for the file when generating output for an adapter. The default filename is `i18n-[adapter]`.

#### `tempPath`

Folder where the generator can store temporary files. These files are generated when your base locale is analyzed and the types are generated. The folder will be cleared, after the types were generated. So make sure you use an empty folder, if you change this option.



<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## JSDoc

If you want to use `typesafe-i18n` inside your JavaScript code, you can get also full typesafety by running the [`generator`](#generator) with the `outputFormat` [option](#outputformat) set to `'JavaScript'`. The generator then provides wrappers for the [core functions](#usage) together with [JSDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)  annotations.

> An IDE like [VS Code](https://code.visualstudio.com/) will show you code-completions and errors when you have opened a file in the editor.

In order to get typesafety for your locales files, you need to annotate it like this:

```typescript
// @ts-check

/**
 * @typedef { import('../i18n-types').Translation } Translation
 */

/** @type { Translation } */
module.exports = {

   /* your translations go here */

}
```



<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Namespaces

Namespaces allows you to split your translations in multiple files and only load them on demand. e.g. you could store all translations that are displayed on the `settings`-page in it's own namespace and only load them when a user visits the settings-page.

To create a namespace, you have to create a folder within your bas translations with the name of your namespace that contains a `index.ts` file.
```
src/
   i18n/
      en/
         settings/index.ts
         index.ts
```
In this example the base locale is `en` and we want to have a namespace called `settings`. The `index.ts` file has to export a [`Dictionary`](#dictionary).
e.g.
```typescript
import type { BaseTranslation } from '../../i18n-types'

const en_settings: BaseTranslation = { }

export default en_settings
```

Once you have created that file, the [`generator`](#typesafety) will automatically create boilerplate namespace files for all your other locales and assign the correct type to them.

By default translations inside namespaces are not loaded. You have to manually load them via `loadNamespaceAsync`.

```ts
const displaySettingsPage = async (locale) => {
   await loadNamespaceAsync(locale, 'settings')
   setLocale(locale)

   // goto settings page
}
```
> make sure to call `setLocale` after you load new namespaces !


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Dictionary

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/runtime)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Syntax

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/runtime)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Formatters

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/formatters)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Switch-Case

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/runtime#switch-case)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Locale-detection

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/detectors)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Integration with other services

`typesafe-i18n` comes with an API that allows other services to read and update translations.

Services that work with `typesafe-i18n`:
- [inlang](https://github.com/inlang/inlang): An open source translation management dashboard with machine translations and automatic sync. Inlang allows non-technical team members, or external translators to adjust translations without touching the source code.

But you can also connect other services by using the `importer` and `exporter` functionality:


### Importer

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/importer)

### Exporter

This part of the documentation [was moved to a new location](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/exporter)

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Sizes

The footprint of the `typesafe-i18n` package is smaller compared to other existing i18n packages. Most of the magic happens in development mode, where the generator creates TypeScript definitions for your translations. This means, you don't have to ship the whole package to your users. The only two parts, that are needed in production are:

- string-parser: detects variables, formatters and plural-rules in your localized strings
- translation function: injects arguments, formats them and finds the correct plural form for the given arguments

These parts are bundled into the [core functions](#custom-usage). The sizes of the core functionalities are:

- [i18nString](#i18nString): 948 bytes gzipped
- [i18nObject](#i18nObject): 1090 bytes gzipped
- [i18n](#i18n): 1122 bytes gzipped

Apart from that there can be a small overhead depending on which utilities and wrappers you use.

There also exists a useful wrapper for some frameworks:
- [typesafe-i18n angular-service](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/angular): 1398 bytes gzipped
- [typesafe-i18n react-context](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/react): 1600 bytes gzipped
- [typesafe-i18n svelte-store](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/svelte): 1345 bytes gzipped
- [typesafe-i18n vue-plugin](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/vue): 1257 bytes gzipped



<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Performance

The package was optimized for performance:
 - **the amount of network traffic is kept small**\
   The translation functions are [small](#sizes). Only the locales that are used are [loaded](#asynchronous-loading-of-locales)
 - **no unnecessary workload**\
   Parsing your translation file for variables and formatters will only be performed when you access a translation for the first time. The result of that parsing process will be stored in an optimized object and kept in memory.
 - **fast translations**\
	Passing variables to the [translation function](#usage) will be fast, because its treated like a simple string concatenation. For formatting values, a single function is called per [formatter](#formatters).

If you use `typesafe-i18n` you will get a smaller bundle compared to other i18n solutions. But that doesn't mean, we should stop there. There are some possible optimizations planned to [decrease the bundle size even further](https://github.com/ivanhofer/typesafe-i18n/discussions/89).



<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## FAQs

---
Dou you still have some questions? Reach out to us via [Github Discussions](https://github.com/ivanhofer/typesafe-i18n/discussions) or on [Discord](https://discord.gg/T27AHfaADK).

---
### Installing `typesafe-i18n` fails

Running the `npx` command with a `npm` version `<7.0.0` will probably fail because it [**will not include** `peerDependencies`](https://github.blog/2020-10-13-presenting-v7-0-0-of-the-npm-cli).

You could try installing it locally via:

```bash
npm install typesafe-i18n
```

and then run  the setup-command from within the `node_modules` folder via:

```bash
./node_modules/typesafe-i18n/cli/typesafe-i18n.mjs --setup-auto
```

> here is the original issue with some additional information: [#142](https://github.com/ivanhofer/typesafe-i18n/issues/142)

---
### I added a new translation to my locale file, but TypeScript gives me the Error `Property 'XYZ' does not exist on type 'TranslationFunctions'`

Make sure to run the [generator](#typesafety) after you make changes to your base translation file. The generator will [generate and update the types](#folder-structure) for you.

---
### I don't use TypeScript, can I also use `typesafe-i18n` inside JavaScript applications?

Yes, you can. See the [usage](#custom-usage) section for instructions. Even if you don't use TypeScript you can still improve from some typesafety features via [JSDoc-annotations](#jsdoc).

---
### I added a new translation to my locale file, but the generator will not create new types

The [generator](#typesafety) will only look for changes in your base locale file. Make sure to always update your base locale file first, in order to get the correct auto-generated types. If you want to [change your base locale file](#baselocale), make sure to give it the type of `BaseTranslation`. All other locales should have the type of `Translation`. E.g. if you set your base locale to italian, you would need to do it like this:

 - set your base locale to italian (`it`) in ´.typesafe-i18n.json`:
   ```json
   {
      "baseLocale": "it"
   }
   ```

 - define the type of your base locale as `BaseTranslation`
   ```typescript
   // file 'src/i18n/it/index.ts'
   import type { BaseTranslation } from '../i18n-types'

   const it: BaseTranslation = {
      WELCOME: "Benvenuto!"
   }

   export default it
   ```

 - define the type of your other locales as `Translation`
   ```typescript
   // file 'src/i18n/en/index.ts'
   import type { Translation } from '../i18n-types'

   const en: Translation = {
      WELCOME: "Welcome!"
   }

   export default en
   ```

---
### The generator keeps overriding my changes I make to the i18n-files

The [generator](#typesafety) creates some helpful wrappers for you. If you want to write your own wrappers, you can disable the generation of these files by setting the [`generateOnlyTypes`](#generateonlytypes) option to `true`.

---
### Is `typesafe-i18n` supported by `i18n-ally`?

Yes, you can configure `i18n-ally` like [this](https://github.com/lokalise/i18n-ally/issues/678#issuecomment-947338325). There is currently also an open [`PR`](https://github.com/lokalise/i18n-ally/pull/681) that will add official support for `typesafe-i18n`.

---
### How can I access a translation dynamically?

When you want to dynamically access a translation, you can use the usual JavaScript syntax to access a property via a variable (`myObject[myVariable]`).

1. define your translations
```ts
// i18n/en.ts
import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
   category: {
      simple: {
         title: 'Simple title',
         description: 'I am a description for the "simple" category',
      },
      advanced: {
         title: 'Advanced title',
         description: 'I am a description for the "advanced" category',
      }
   }
}

export default en
```

2. use it in your components

```svelte
<script lang="ts">
   // Component.svelte

   import LL from '$i18n/i18n-svelte'
   import type { Translation } from '$i18n/i18n-types'

   // ! do not type it as `string`
   // by restricting the type, you don't loose the typesafety features
   export let category: keyof Translation['category'] = 'simple'
</script>

<h2>{$LL.category[category].title()}

<p>
   {$LL.category[category].description()}
<p>
```


---
### How do I render a component inside a Translation?

By default `typesafe-i18n` at this time does not provide such a functionality. But you could easily write a function like this:

```jsx
import { LocalizedString } from 'typesafe-i18n'

// create a component that handles the translated message

interface WrapTranslationPropsType {
   message: LocalizedString,
   renderComponent: (messagePart: LocalizedString) => JSX.Element
}

export function WrapTranslation({ message, renderComponent }: WrapTranslationPropsType) {
   // define a split character, in this case '<>'
   let [prefix, infix, postfix] = message.split('<>') as LocalizedString[]

   // render infix only if the message doesn't have any split characters
   if (!infix && !postfix) {
      infix = prefix
      prefix = '' as LocalizedString
   }

   return <>
      {prefix}
      {renderComponent(infix)}
      {prefix}
   </>
}

// your translations would look something like this

const en = {
   'WELCOME': 'Hi {name:string}, click <>here<> to create your first project'
   'LOGOUT': 'Logout'
}

export default en


// create a wrapper for a component for easier usage

interface WrappedButtonPropsType {
   message: LocalizedString,
   onClick: () => void,
}

export function WrappedButton({ message, onClick }: WrappedButtonPropsType) {
   return <WrapTranslation
      message={message}
      renderComponent={(infix) => <button onClick={onClick}>{infix}</button>} />
}

// use it inside your application

export function App() {
   return <>
      <header>
         <WrappedButton message={LL.LOGOUT()} onClick={() => alert('do logout')}>
      </header>
      <main>
         <WrappedButton message={LL.WELCOME({ name: 'John' })} onClick={() => alert('clicked')}>
      </main>
   <>
}

```
> This is an example written for a react application, but this concept can be used with any kind of framework.

Basically you will need to write a function that splits the translated message and renders a component between the parts. You can define your split characters yourself but you would always need to make sure you add them in any translation since `typesafe-i18n` doesn't provide any typesafety for these characters (yet).

---
### I have two similar locales (only a few translations are different) but I don't want to duplicate my translations

Your locale translation files can be any kind of JavaScript object. So you can make object-transformations inside your translation file. The only restriction is: in the end it has to contain a default export with type `Translation`. You could do something like this:

 - create your `BaseTranslation`
   ```typescript
   // file 'src/i18n/en/index.ts'
   import type { BaseTranslation } from '../i18n-types'

   const en: BaseTranslation = {
      WELCOME: "Welcome to XYZ",
      // ... some other translations

      COLOR: "colour"
   }

   export default en
   ```

 - create your other translation that overrides specific translations
   ```typescript
   // file 'src/i18n/en-US/index.ts'
   import type { Translation } from '../i18n-types'
   import en from '../en' // import translations from 'en' locale

   const en_US: Translation = {
      ...en, // use destructuring to copy all translations from your 'en' locale

      COLOR: "color" // override specific translations
   }

   export default en_US
   ```

---
### For certain locales I don't want to output a variable, but due to the strict typing I have to specify it in my translation

The generated types are really strict. It helps you from making unintentional mistakes. If you want to opt-out for certain translations, you can use the `any` keyword.

 - create your `BaseTranslation` with a translation containing a parameter
   ```typescript
   // file 'src/i18n/en/index.ts'
   import type { BaseTranslation } from '../i18n-types'

   const en: BaseTranslation = {
      HELLO: "Hi {name}!",
   }

   export default en
   ```

 - create another locale without that parameter by disabling the strict type checking with  `as any`
   ```typescript
   // file 'src/i18n/de/index.ts'
   import type { Translation } from '../i18n-types'

   const de: Translation = {
      HELLO: "Hallo!" as any // we don't want to output the 'name' variable
   }

   export default de
   ```

> WARNING! the usage of 'any' can introduce unintentional mistakes in future. It should only be used when really necessary and you know what you are doing.

A better approach would be to create a custom formatter e.g.

 - create your translation and add a formatter to your variable
   ```typescript
   // file 'src/i18n/en/index.ts'
   import type { BaseTranslation } from '../i18n-types'

   const en: BaseTranslation = {
      HELLO: "Hi {name|nameFormatter}!",
   }

   export default en
   ```

   ```typescript
   // file 'src/i18n/de/index.ts'
   import type { Translation } from '../i18n-types'

   const de: Translation = {
      HELLO: "Hallo {name|nameFormatter}!"
   }

   export default de
   ```

 - create the formatter based on the locale
   ```typescript
   // file 'src/i18n/formatters.ts'
   import type { FormattersInitializer } from 'typesafe-i18n'
   import type { Locales, Formatters } from './i18n-types'
   import { identity, ignore } from 'typesafe-i18n/formatters'

   export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales)    => {

      const nameFormatter =
         locale === 'de'
            // return an empty string for locale 'de'
            ? ignore // same as: () => ''
            // return the unmodified parameter
            : identity // same as: (value) => value

      const formatters: Formatters = {
         nameFormatter: nameFormatter
      }

      return formatters
   }
   ```

---
### Why does the translation function return a type of `LocalizedString` and not the type `string` itself?

With the help of `LocalizedString` you could enforce texts in your application to be translated. Lets take an Error message as example:

```typescript
const showErrorMessage(message: string) => alert(message)

const createUser = (name: string, password: string) => {
   if (name.length === 0) {
      showErrorMessage(LL.user.create.nameNotProvided())
      return
   }

   if (isStrongPassword(password)) {
      showErrorMessage('Password is to weak')
      return
   }

   // ... create user in DB
}
```

In this example we can pass in any string, so it can also happen that some parts of your application are not translated. To improve your i18n experience a bit we can take advantage of the `LocalizedString` type:

```typescript
import type { LocalizedString } from 'typesafe-i18n'

const showErrorMessage(message: LocalizedString) => alert(message)

const createUser = (name: string, password: string) => {
   if (name.length === 0) {
      showErrorMessage(LL.user.create.nameNotProvided())
      return
   }

   if (isStrongPassword(password)) {
      showErrorMessage('Password is to weak') // => ERROR: Argument of type 'string' is not assignable to parameter of type 'LocalizedString'.
      return
   }

   // ... create user in DB
}
```

With the type `LocalizedString` you can restrict your functions to only translated strings.

---

### Tests are not running with `Jest`

Unfortunately there are some open issues in the [`Jest`](https://jestjs.io/) repository regarding modern package export formats so `jest` doesn't know where to load files from.

You need to manually tell `jest` where these files should be loaded from, by defining [`moduleNameMapper`](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring) inside your `jest.config.js`:

```js
// jest.config.js
module.exports = {
   moduleNameMapper: {
      "typesafe-i18n/adapters/(.*)": "typesafe-i18n/adapters/$1.cjs",
      "typesafe-i18n/detectors": "typesafe-i18n/detectors/index.cjs",
   }
};
```

> here is the original issue with some additional information: [#140](https://github.com/ivanhofer/typesafe-i18n/issues/140)

---
### With Node.JS the `Intl` package does not work with locales other than 'en'

Node.JS, by default, does not come with the full [`intl`](https://nodejs.org/api/intl.html) support. To reduce the size of the node installment it will only include 'en' as locale. You would need to add it yourself. The easiest way is to install the `intl` package

```bash
> npm install intl
```

and then add following lines on top of your `src/i18n/formatters.ts` file:

```typescript
const intl = require('intl')
intl.__disableRegExpRestore()
globalThis.Intl.DateTimeFormat = intl.DateTimeFormat
```

Then you should be able to use formatters from the `Intl` namespace with all locales.

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Sponsors

[Become a sponsor :heart:](https://github.com/sponsors/ivanhofer) if you want to support my open source contributions.

<h3 align="center">
   Backers
</h3>

<p align="center">
   <a href="https://github.com/Kraftwurm">
      <img src="https://github.com/Kraftwurm.png" width="50px" alt="Kraftwurm" style="border-radius: 50%"/>
   </a>
   <a href="https://github.com/Badlapje">
      <img src="https://github.com/Badlapje.png" width="50px" alt="Badlapje" style="border-radius: 50%"/>
   </a>
</p>

<p align="center">
   Thanks for sponsoring my open source work!
</p>
