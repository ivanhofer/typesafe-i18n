# CHANGELOG.md

## 2.27.0 (unreleased)

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
 - link immages to correct raw file

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
