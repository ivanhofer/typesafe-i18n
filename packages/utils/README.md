# `typesafe-i18n` Utils

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

## provided utility functions

### `extendDictionary`

Allows you to only override a subset of the dictionary.

```ts
import { extendDictionary } from '../i18n-utils'
import en from '../en' // import translations from 'en' locale

const en_US = extendDictionary(en, {
   labels: {
      color: "color" // override specific translations
   }
})

export default en_US
```
> uses [`just-extend`](https://github.com/angus-c/just#just-extend) under the hood
