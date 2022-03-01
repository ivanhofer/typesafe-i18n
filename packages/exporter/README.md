# `typesafe-i18n` Exporter

In order to export language files to a service or an API, `typesafe-i18n` provides an `exporter` functionality.

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`

### manual installation

```bash
npm install typesafe-i18n
```

## Example

An example implementation can be seen in the [`exporter.ts`-file](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/exporter/examples/exporter.ts).

> you need to run this script during development or as a CI-process and **not** at runtime. Create an own file with the implementation and run it with [`tsm`](https://github.com/lukeed/tsm) or something similar.

To run this example execute following command in your terminal:

```sh
npm run i18n:export
```

You should see the result of the exporter show up in your terminal.

In a real world implementation you would have to write your own logic to send the data to a service.

> Please share your implementation in a PR. `typesafe-i18n` wants to provide built-in exporter-packages in the future.

## `typesafe-i18n/exporter`

The `typesafe-i18n/exporter` package provides following:


### `ExportLocaleMapping` interface

```ts
interface ExportLocaleMapping {
   locale: string
   translations: BaseTranslation | BaseTranslation[]
   namespaces: string[]
}
```

### `readTranslationFromDisk` function

```ts
(locale: Locale) => Promise<ExportLocaleMapping>
```

### `readTranslationsFromDisk` function

```ts
() => Promise<ExportLocaleMapping[]>
```
