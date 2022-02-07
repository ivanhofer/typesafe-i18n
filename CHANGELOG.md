# CHANGELOG.md

# Version 4

## 4.0.0 (2022-02-07)

Feature:
 - add 'namespaces' functionality [#113](https://github.com/ivanhofer/typesafe-i18n/discussions/113)

BREAKING:
 - if you have a `index`-file in a subfolder of your translation files, it will be treated as a `namespace`

# Version 3

## 3.1.3 (2022-02-07)

Bugfix:
 - fix react adapter

## 3.1.2 (2022-02-04)

Fix:
 - missing index.d.ts in importer [#167](https://github.com/ivanhofer/typesafe-i18n/issues/167)

## 3.1.1 (2022-02-01)

New Backers:
 - [Kraftwurm](https://github.com/Kraftwurm)
 - [Badlapje](https://github.com/Badlapje)

## 3.1.0 (2022-02-01)

Feature:
 - allow iterating over arrays defined in the dictionary
 - render an empty string, if key is not valid

## 3.0.0 (2022-01-29)

Please visit the [release post](https://github.com/ivanhofer/typesafe-i18n/discussions/163) for more information.

BREAKING:
 - locales have to be loaded in a separate step
 - remove `loadLocalesAsync` option from generator
 - formatters have to be initialized synchronously

closes:
 - [#159](https://github.com/ivanhofer/typesafe-i18n/issues/159)
 - [#64](https://github.com/ivanhofer/typesafe-i18n/issues/64)

# Version 2

## 2.60.2 (2022-01-28)

Fix:
 - revert changes made to fallbackProxy [#157](https://github.com/ivanhofer/typesafe-i18n/issues/157)

## 2.60.1 (2022-01-22)

Feature:
 - add functionality to loop over arrays [#152](https://github.com/ivanhofer/typesafe-i18n/discussions/152)

## 2.59.0 (2022-01-18)

Feature:
 - add support for JSON files [#151](https://github.com/ivanhofer/typesafe-i18n/discussions/151)

## 2.58.0 (2022-01-09)

Feature:
  add better support for monorepos [#149](https://github.com/ivanhofer/typesafe-i18n/discussions/149)

## 2.57.7 (2022-01-09)

- add troubleshoot section for jest issues [#140](https://github.com/ivanhofer/typesafe-i18n/issues/140)

## 2.57.6 (2022-01-09)

- add troubleshoot section for installing issues [#142](https://github.com/ivanhofer/typesafe-i18n/issues/142)

## 2.57.5 (2022-01-02)

- show sponsorship message after running the setup-process

## 2.57.4 (2021-12-28)
## 2.57.3 (2021-12-28)
## 2.57.2 (2021-12-28)

Fix:
- rename Vue.js exports

## 2.57.1 (2021-12-27)

Bugfix:
- fix CLI script

## 2.57.0 (2021-12-27)

Feature:
 - add `vue` adapter (for vue@3) [#121](https://github.com/ivanhofer/typesafe-i18n/discussions/121)

## 2.56.0 (2021-12-14)

Feature:
 - support `pnpm` as package manager when running the setup-cli [#138](https://github.com/ivanhofer/typesafe-i18n/issues/138)

## 2.55.1 (2021-12-06)

Fix:
 - fix type definition of TranslationFunction for Typescript > 4.5.x [#136][https://github.com/ivanhofer/typesafe-i18n/issues/136)

## 2.55.0 (2021-12-05)

Feature:
 - add switch-case support [#135](https://github.com/ivanhofer/typesafe-i18n/discussions/135)

## 2.54.3 (2021-11-27)

Bugfix:
 - fix Proxy-access [#133](https://github.com/ivanhofer/typesafe-i18n/issues/133)

## 2.54.2 (2021-11-26)

Bugfix:
 - fix Proxy-access for CJS projects [#131](https://github.com/ivanhofer/typesafe-i18n/issues/131)

## 2.54.0 (2021-11-25)

 - decrease bundle size by a few bytes by removing Angular proxy wrapping on general Proxy instances

## 2.53.2 (2021-11-24)

Fix:
 - `BaseTranslation` type for TypeScript version < 4.4.x [#127](https://github.com/ivanhofer/typesafe-i18n/issues/127)

## 2.53.0 (2021-11-24)

Feature:
 - expose `parser` function

## 2.52.2 (2021-11-20)

Fix:
 - add `$schema` to json schema definition

## 2.52.1 (2021-11-19)

Fix:
 - detect if project uses `npm` or `yarn` on CLI setup process

## 2.52.0 (2021-11-18)

Feature:
 - add validation of config [#112](https://github.com/ivanhofer/typesafe-i18n/discussions/112)

## 2.51.1 (2021-11-17)

Feature:
 - add support for arrays [#123](https://github.com/ivanhofer/typesafe-i18n/discussions/123)

## 2.50.1 (2021-11-12)

Bugfix:
 - fix CLI setup

## 2.50.0 (2021-11-12)

 - upgrade to node 16

Fix:
 - default export of generated Locale template file for SvelteKit

## 2.49.4 (2021-11-07)

Fix:
 - don't run the generator on CLI setup; show info instead

## 2.49.3 (2021-11-06)

Bugfix:
 - add `typescript` as peer dependency

## 2.49.2 (2021-11-06)

Bugfix:
 - include `chokidar` into bundle

## 2.49.1 (2021-11-06)

Fix:
 - SvelteKit workaround for `esmModule` setup detection

## 2.49.0 (2021-11-06)

Feature:
 - setup CLI

## 2.48.0 (2021-11-01)

Feature:
 - create typesafe-i18n `CLI`

## 2.47.0 (2021-10-31)

Feature:
 - add option to prevent type updates when importing translations

## 2.46.8 (2021-10-29)

Bugfix:
 - wrap translation with correct characters [#114](https://github.com/ivanhofer/typesafe-i18n/issues/114)

## 2.46.7 (2021-10-25)

Fix:
 - expose type `LocaleMapping` inside `importer` and `exporter`

## 2.46.6 (2021-10-25)

Bugfix:
 - fix `typescript` import inside `importer` and `exporter`

## 2.46.5 (2021-10-24)

Fix:
 - change everything to relative imports so types are resolved correctly

## 2.46.4 (2021-10-19)

Bugfix:
 - fix import path for windows/other and esm/cjs matrix

## 2.46.3 (2021-10-19)

Bugfix:
 - wrap imported keys with string [#110](https://github.com/ivanhofer/typesafe-i18n/issues/110)

## 2.46.2 (2021-10-19)

Fix:
 - show warning when trying to import empty locale
 - expose `importer` and `exporter` as `esm` and `cjs` module

## 2.46.1 (2021-10-19)

Bugfix:
 - fix import path on windows [#108](https://github.com/ivanhofer/typesafe-i18n/issues/108)

## 2.46.0 (2021-10-18)

Feature:
 - add `exporter` feature [#106](https://github.com/ivanhofer/typesafe-i18n/issues/106

## 2.45.0 (2021-10-16)

Feature:
 - feat: reduce size of `i18n` (L) by removing unnecessary Error message

## 2.44.3 (2021-10-15)

Fix:
 - detect changes to base translation when using outputFormat: 'JavaScript' [#105](https://github.com/ivanhofer/typesafe-i18n/issues/105)

## 2.44.2 (2021-10-14)

Bugfix:
 - generate types for `importer`

## 2.44.1 (2021-10-14)

Fix:
 - fix variable declaration of `JavaScript` locale template to be able to display type errors

## 2.44.0 (2021-10-14)

Feature:
 - export generator as `esm` module to make it compatible with `SvelteKit` in `JavaScript` mode

## 2.43.1 (2021-10-14)

Fix:
 - actually include `importer` in `npm` package

## 2.43.0 (2021-10-12)

Feature:
 - add `importer` feature [#69](https://github.com/ivanhofer/typesafe-i18n/issues/69

## 2.42.0 (2021-10-02)

Breaking:
 - get rid of `locales` as generator-config [#95](https://github.com/ivanhofer/typesafe-i18n/discussions/95)

## 2.41.0 (2021-10-02)

Feature:
 - add support for optional parameters [#86](https://github.com/ivanhofer/typesafe-i18n/issues/86

## 2.40.2 (2021-09-26)

 - show link to `config`-README on first start of the `generator`

## 2.40.1 (2021-09-22)
## 2.40.0 (2021-09-22)

Feature:
 - add angular adapter
 - add full `esm` support for adapters

## 2.39.1 (2021-09-15)

Bugfix:
 - fix import folders when using `esm` support

## 2.39.0 (2021-09-15)

Feature:
 - add full `esm` support [#80](https://github.com/ivanhofer/typesafe-i18n/issues/80)

## 2.38.0 (2021-09-14)

Feature:
 - throw an Error when generator detects wrong input syntax when running with `--no-watch` option

## 2.37.4 (2021-08-26)

Bugfix:
 - correctly detect changes in files imported by `[baseLocale]/index.ts` [#76](https://github.com/ivanhofer/typesafe-i18n/issues/76)

## 2.37.3 (2021-08-25)

Bugfix:
 - allow to generate base files if base locale is not present yet

## 2.37.2 (2021-08-25)

Fix:
 - import path of types for `time` formatter

## 2.37.1 (2021-08-25)

Fix:
 - generate unique argument types for `Formatters` type [#75](https://github.com/ivanhofer/typesafe-i18n/issues/75)

## 2.37.0 (2021-08-24)

Feature:
 - allow to import files to the base locale file from outside of the base locale folder location

## 2.36.1 (2021-08-21)

Fix:
 - mark `chokidar` as dev dependency [#73](https://github.com/ivanhofer/typesafe-i18n/issues/73)

## 2.36.0 (2021-07-27)

Fix:
 - fix all 'esm' and 'cjs' imports to include file ending

## 2.35.3 (2021-07-26)

Fix:
 - export files from 'cjs' folder as `.cjs` files

## 2.35.2 (2021-07-26)

Fix:
 - export files from 'esm' folder as `.mjs` files

## 2.35.1 (2021-07-19)

Bugfix:
 - remove `browser` property from `package.json` to support older Angular versions

## 2.35.0 (2021-07-19)

Feature:
 - add option to generate type-safe JavaScript code trough JSDoc annotations

Readme:
 - add polyfill info

## 2.34.0 (2021-07-15)

Feature:
 - add support for Angular's Proxy implementation

## 2.33.0 (2021-07-09)

Feature:
 - add `LocalizedString` to known types

## 2.32.3 (2021-07-07)
## 2.32.2 (2021-07-07)
## 2.32.1 (2021-07-07)

Bugfix:
 - fix `esm` output for `react` adapter

## 2.32.0 (2021-07-01)

Fix:
 - make formatters tree-shakeable
 - make detectors tree-shakeable

## 2.31.0 (2021-06-30)

Feature:
 - output formatters as `cjs` and `esm` module

## 2.30.1 (2021-06-28)

Fix:
 - show translations on first render for sync react adapter

## 2.30.0 (2021-06-25)

Feature:
 - output svelte adapter as `cjs` and `esm` module

Fix:
 - fix `cjs` and `esm` import mappings

## 2.29.0 (2021-06-25)

Feature:
 - output react adapter as `cjs` and `esm` module

## 2.28.0 (2021-06-25)

Feature:
 - add `--no-watch` option to generator node process

## 2.27.0 (2021-06-18)

Feature:
 - make `TranslationFunctions` return a `LocalizedString`
 - add [`banner`](https://github.com/ivanhofer/typesafe-i18n#banner) option to make it possible to disable linting not just for [ESLint](https://eslint.org/)

## 2.26.3 (2021-06-07)

Fix:
 - fix react adapter [#49](https://github.com/ivanhofer/typesafe-i18n/issues/49)

## 2.26.2 (2021-06-07)

Fix:
 - fix wrong types for react and svelte adapters

## 2.26.1 (2021-06-07)

Fix:
 - temporary fix for wrong tsc compilation for react and svelte adapters
 - correctly set formatter path for react adapter

## 2.26.0 (2021-06-07)

Feature:
 - add support for nested translation keys
 - show colorized error-output in console

Fix:
 - don't generate types when validation failed

Breaking:
 - translation keys can't contain the '.' character

Other:
 - don't generate type `TranslationKeys` anymore

## 2.25.0 (2021-05-27)

 - rename `watcher` to `generator`

## 2.24.1 (2021-05-25)

Fix:
 - inlude `detectors` files in npm package

## 2.24.0 (2021-05-25)

Feature:
 - add locale-detection feature

## 2.23.2 (2021-05-19)

Fix:
 - use correct file extension when generating react context

## 2.23.1 (2021-05-19)

Fix:
 - fix path for generating schema file

## 2.23.0 (2021-05-19)

 - better type-definitions for formatter functions

## 2.22.0 (2021-05-16)

Feature:
 - add [generateOnlyTypes](https://github.com/ivanhofer/typesafe-i18n#generateOnlyTypes) option
 - add [identity](https://github.com/ivanhofer/typesafe-i18n#identity) formatter
 - add [ignore](https://github.com/ivanhofer/typesafe-i18n#ignore) formatter

Readme:
 - create FAQ section

Fix:
 - wrap types of Formatters in a `string` to be able to use any kind of formatter name

## 2.21.1 (2021-05-15)

Fix:
 - mark `chokidar` as peer dependency

## 2.21.0 (2021-05-15)

Fix:
 - explicitly type parameter `locale` in `initFormatters` function

## 2.20.1 (2021-05-13)

Fix:
 - use path with implicit version for `"$schema"` in `./typesafe-i18n.json` because redirects are not valid for json schemas

## 2.20.0 (2021-05-13)

Feature:
 - add json-schema for `./typesafe-i18n.json` config file

Examples:
 - update dependencies

## 2.19.1 (2021-05-11)

- update dependencies

Bugfix:
 - better types for `TranslationFunctions`

## 2.19.0 (2021-05-07)

Fix:
 - remove `.toString()` functionality [#27](https://github.com/ivanhofer/typesafe-i18n/issues/27)

## 2.18.0 (2021-04-30)

Feature:
 - add support for plural rule `{{zero|one|other}}`

Fix:
 - detect `0` and `'0'` always as `'zero'` instead of `'other'`

## 2.17.4 (2021-04-27)

Examples:
 - update to latest `typesafe-i18n` version

## 2.17.3 (2021-04-27)

Fix:
 - mark node script as node executable

## 2.17.2 (2021-04-26)

Examples:
 - update to latest `typesafe-i18n` version

## 2.17.1 (2021-04-26)

Fix:
 - run watcher via `bin`-field in `package.json` [#30](https://github.com/ivanhofer/typesafe-i18n/issues/30)

## 2.17.0 (2021-04-26)

Feature:
 - add unix support for watcher [#29](https://github.com/ivanhofer/typesafe-i18n/issues/29)

## 2.16.1 (2021-04-23)

 - add CHANGELOG file

Fix:
 - add deprecation message for `.toString()` functionality [#27](https://github.com/ivanhofer/typesafe-i18n/issues/27)

## 2.16.0 (2021-04-17)

Features:
 - add webpack plugin to run watcher in development mode

Bugfix:
 - log watcher-options on startup

## 2.15.5 (2021-04-13)

Readme:
 - better describe watcher node-process as fallback for users without supported bundlers

## 2.15.4 (2021-04-09)

Examples:
 - update to latest `typesafe-i18n` version

## 2.15.3 (2021-04-09)

Fix:
 - remove a unecessary semicolumn from generated output

## 2.15.2 (2021-04-09)

 - update dependencies

## 2.15.1 (2021-04-02)

 - upload generated browser bundles as GitHub Action artifact

## 2.15.0 (2021-04-02)

Feature:
 - allow to include only selected locales into generated bundle using the [rollup-plugin](https://github.com/ivanhofer/typesafe-i18n#rollup-plugin)

Fix:
 - use `baseLocale` variable as fallback instead of plain string representation inside `i18n-util.ts`

Readme:
 - better describe `locales` option from production bundles

## 2.14.2 (2021-03-26)

Bugfix:
 - correctly type `initI18nString` inside `i18n-util.ts`

## 2.14.1 (2021-03-24)

Readme:
 - describe `toString` functionality using `i18nObject` (LL)

## 2.14.0 (2021-03-24)

Feature;
 - add `toString` functionality to `i18nObject` (LL)

## 2.13.2 (2021-03-23)

Readme:
 - update size information

## 2.13.1 (2021-03-23)

Readme:
 - fix intendation

## 2.13.0 (2021-03-23)

Feature:
 - refactor `typesafe-i18n` react-component

Security:
 - update dependencies

## 2.12.2 (2021-03-19)

Examples:
 - fix intendation and syntax-highlighting in react README

## 2.12.1 (2021-03-19)

Readme:
 - better describe `rollup-plugin-typesafe-i18n`

Examples:
 - describe how to use with JavaScript in react README

## 2.12.0 (2021-03-17)

Feature:
 - rewrite react adapter using a component instead of hook

## 2.11.1 (2021-03-17)

Fix:
 - use wattcher or optimizer rollup plugin depending on rollup environment

## 2.11.0 (2021-03-17)

Feature:
 - add react JavaScript adapter

## 2.10.3 (2021-03-17)

Fix:
 - generate async `i18nString` wrapper inside `i18n-utils.ts`

## 2.10.2 (2021-03-16)

Examples:
 - fix intendation in react README

## 2.10.1 (2021-03-16)

Examples:
 - add react example

## 2.10.0 (2021-03-16)

Feature:
 - add react TypeScript adapter

## 2.9.2 (2021-03-14)

Readme:
 - improve screenshots by cropping VS Code frame

## 2.9.1 (2021-03-14)

Readme:
 - highlight possible improvements

## 2.9.0 (2021-03-14)

Feature:
 - remove argument-types inside translations for production-bundle [#13](https://github.com/ivanhofer/typesafe-i18n/issues/13)

Examples:
 - fix labels in svelte example

## 2.8.3 (2021-03-14)

Examples:
 - update to latest `typesafe-i18n` version

## 2.8.2 (2021-03-14)

Fix:
 - import svelte adapter from correct file

## 2.8.1 (2021-03-14)

Fix:
 - export svelte JavaScript adapter

## 2.8.0 (2021-03-14)

Feature:
 - generate async formatters initializer

Fix:
 - rename exported functions

## 2.7.1 (2021-03-10)

Readme:
 - decrease gif file size

## 2.7.0 (2021-03-08)

Fix:
 - reduce bundle size by inlining functions from `typesafe-utils`

## 2.6.11 (2021-03-06)

Readme:
 - fix formatter example

## 2.6.10 (2021-03-05)

Readme:
 - add status badges

## 2.6.9 (2021-03-03)

Readme:
 - highlight advantages
 - add table of contents
 - add performance section

## 2.6.8 (2021-03-03)

Readme:
 - improvements

## 2.6.7 (2021-03-01)

Readme:
 - improvements

## 2.6.6 (2021-03-01)

Readme:
 - increase font size of images

## 2.6.5 (2021-03-01)

Fix:
 - export svelte store from adapters subpath

## 2.6.4 (2021-02-28)

Readme:
 - increase font size of images

## 2.6.3 (2021-02-28)

Readme:
 - add gif demonstrating typesafety

## 2.6.2 (2021-02-28)

Readme:
 - link images to correct raw file

## 2.6.1 (2021-02-28)

Readme:
 - add images demonstrating typesafety

## 2.6.0 (2021-02-28)

Feature:
 - allow first part to be plural part when using keyed arguments

## 2.5.0 (2021-02-28)

Feature:
 - allow translations with only plural part

## 2.4.1 (2021-02-24)

Readme:
 - specify minimum Node.js version

## 2.4.0 (2021-02-24)

Examples:
 - add browser example
 - describe how to use with JavaScript in svelte README

## 2.3.0 (2021-02-23)

Feature:
 - export svelte JavaScript store

Readme:
 - improvements

## 2.2.5 (2021-02-23)

Fix:
 - add export maps for svelte adapter

Examples:
 - add Node.js readme

## 2.2.4 (2021-02-22)

Examples:
 - add Node.js example

## 2.2.3 (2021-02-22)

Feature:
 - export base locale in `i18n-utils.ts`

Fix:
 - improve Node.js adapter

## 2.2.2 (2021-02-22)

Examples:
 - update svelte-Example

## 2.2.1 (2021-02-22)

Examples:
 - move svelte documentation to svelte example

## 2.2.0 (2021-02-22)

Feature:
 - use base locale as fallback if wrong locale was passed during initialization

## 2.1.0 (2021-02-19)

Feature:
 - add Node.js adapter
 - add possibility to define different adapters
 - allow to rename adapter file name

## 2.0.5 (2021-02-19)

Examples:
 - add readme for svelte example

## 2.0.4 (2021-02-17)

Examples:
 - add svelte example

## 2.0.3 (2021-02-17)

Bugfix:
 - dont throw Error when `setLocale` is called before `init` in svelte-adapter

## 2.0.2 (2021-02-16)

Bugfix:
 - correctly set current selected locale in svelte store
 - add possibility to output svelte as synchronous store

## 2.0.1 (2021-02-16)

Bugfix:
 - fix synchronous output of `i18n-utils.ts`

## 2.0.0 (2021-02-16)

  - initial release of project under `typesafe-i18n` name
