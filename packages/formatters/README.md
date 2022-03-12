# `typesafe-i18n` Formatters

You can also format values you pass as an argument to `typesafe-i18n`.

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

## Example

You  can find an example how to configure and use formatters [here](https://github.com/ivanhofer/typesafe-i18n/blob/main/packages/formatters/example).

You can run the example by opening the folder in your terminal and running:

```bash
npm run dev
```

## Specify a formatter

You can specify your own formatters, that take an argument as an input and returns another value.

```typescript
const formatters = {
   custom: (value) => (value * 4.2) - 7
}

LLL("For input '{0}' I get '{0|custom}' as a result", 100)
// => "For input '100' I get '413' as a result"
```

### chaining formatters

If you need to apply multiple formatters to the same argument, you can chain them by using the pipe `|` operator:

```typescript
const formatters = {
   sqrt: (value) => Math.sqrt(value),
   round: (value) => Math.round(value),
}

LLL('Result: {0|sqrt|round}', 5)
// => 'Result: 2'
```

> The formatters get applied from left to right. So in this example `5` will be the input for the `sqrt` formatter, that will return `2.23606797749979`. This value then gets passed to the `round` formatter that will output `2`.

## builtin formatters

You can also use a few builtin formatters:

### date
A wrapper for [Intl.DateTimeFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).

```typescript
import { date } from 'typesafe-i18n/formatters'

const formatters = {
   weekday: date('en', { weekday: 'long' })
}

LLL('Today is {0|weekday}', new Date()) // => 'Today is friday'
```

> See [here](#with-nodejs-the-intl-package-does-not-work-with-locales-other-than-en) if you want to use this formatter in a Node.JS environment.

### time

Same as the [`date`-formatter](#date)

```typescript
import { time } from 'typesafe-i18n/formatters'

const formatters = {
   timeShort: time('en', { timeStyle: 'short' })
}

LLL('Next meeting: {0|timeShort}', meetingTime) // => 'Next meeting: 8:00 AM'
```

### number
A wrapper for [Intl.NumberFormat](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

```typescript
import { number } from 'typesafe-i18n/formatters'

const formatters = {
   currency: number('en', { style: 'currency', currency: 'EUR' })
}

LLL('Your balance is {0|currency}', 12345) // => 'your balance is €12,345.00'
```

> See [here](#with-nodejs-the-intl-package-does-not-work-with-locales-other-than-en) if you want to use this formatter in a Node.JS environment.

### replace
A wrapper for [String.prototype.replace](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

```typescript
import { replace } from 'typesafe-i18n/formatters'

const formatters = {
   noSpaces: replace(/\s/g, '-')
}

LLL('The link is: https://www.xyz.com/{0|noSpaces}', 'super cool product')
// => 'The link is: https://www.xyz.com/super-cool-product'
```

### identity
Returns the variable without modifications

```typescript
import { identity } from 'typesafe-i18n/formatters'

const formatters = {
   myFormatter: identity // (value) => value
}

LLL('Hello {name|myFormatter}', { name: 'John' })
// => 'Hello John'
```

### ignore
Ignores the variable and returns an empty string.

```typescript
import { ignore } from 'typesafe-i18n/formatters'

const formatters = {
   myFormatter: ignore // () => ''
}

LLL('Hello {name|myFormatter}', { name: 'John' })
// => 'Hello '
```

### uppercase
A wrapper for [String.prototype.toUpperCase](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)

```typescript
import { uppercase } from 'typesafe-i18n/formatters'

const formatters = {
   upper: uppercase
}

LLL('I said: {0|upper}', 'hello') // => 'I said: HELLO'
```

### lowercase
A wrapper for [String.prototype.toLowerCase](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)

```typescript
import { lowercase } from 'typesafe-i18n/formatters'

const formatters = {
   lower: lowercase
}

LLL('He said: {0|lower}', 'SOMETHING') // => 'He said: something'
```

