# `typesafe-i18n` Importer

In order to import language files that come from an API, spreadsheet or JSON-files, `typesafe-i18n` provides an `importer` functionality.
You have to write your own logic to get the data, then map it to a dictionary-representation and then call the `storeTranslationToDisk` function. Here is an example how this could look like:

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

## Example

An example implementation can be seen in the [`importer.ts`-file](https://github.com/ivanhofer/typesafe-i18n/blob/main/packages/importer/example/import.ts).

> you need to run this script during development or as a CI-process and **not** at runtime. Create an own file with the implementation and run it with [`tsm`](https://github.com/lukeed/tsm) or something similar.

To run this example execute following command in your terminal:

```sh
npm run i18n:import
```

You should see a successful log message show up in your terminal.

In a real world implementation you would have to write your own logic to fetch the data from a service.

> Please share your implementation in a PR. `typesafe-i18n` wants to provide built-in importer-packages in the future.

## `typesafe-i18n/importer`

The `typesafe-i18n/importer` package provides following:

### `ImportLocaleMapping` interface

```ts
interface ImportLocaleMapping {
   locale: string
   translations: BaseTranslation | BaseTranslation[]
   namespaces?: string[]
}
```

### `storeTranslationToDisk` function

Can be used to write translations for a single locale to disk. If `locale` matches the `baseTranslation` the generator will automatically run after the import. If you don't want to run the generator after the translations are being imported, set `generateTypes` to `false`.

```ts
(mapping: ImportLocaleMapping, generateTypes?: boolean) => Promise<Locale>
```

### `storeTranslationsToDisk` function

Can be used to write translations for multiple locales to disk. If one of entry's `locale` matches the `baseTranslation` the generator will automatically run after the import. If you don't want to run the generator after the translations are being imported, set `generateTypes` to `false`.

```ts
(mappings: ImportLocaleMapping[], generateTypes?: boolean) => Promise<Locales[]>
```


