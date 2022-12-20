# `typesafe-i18n` Runtime

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```


## Table of Contents

- [**Syntax**](#syntax) - how to write your translations
- [**Usage**](#usage) - how to use the translation functions
- [**Typesafety**](#typesafety) - how to get the best typesafety features
- [**Dictionary**](#dictionary) - how to structure your translations



<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Syntax

For more information about the `LLL` object, read the [usage](#i18nstring) section.

<!-- ------------------------------------------------------------------------------------------ -->

### passing arguments:

 > Syntax: `{index}`

```typescript
const APPLES = '{0} apples'

LLL(APPLES, 12) // => '12 apples'
```

> Arguments don't get transformed. If you want to output locale-specific arguments, take a look at the [`formatter`](#format-passed-in-arguments) syntax.

<!-- ------------------------------------------------------------------------------------------ -->

### passing multiple arguments:

```typescript
const FRUITS = '{0} apples and {1} bananas'

LLL(FRUITS, 3, 7) // => '3 apples and 7 bananas'
```

<!-- ------------------------------------------------------------------------------------------ -->

### passing keyed arguments:

 > Syntax: `{key}`

```typescript
const FRUITS = '{nrOfApples} apples and {nrOfBananas} bananas'

LLL(FRUITS, { nrOfApples: 3, nrOfBananas: 7 }) // => '3 apples and 7 bananas'
```

<!-- ------------------------------------------------------------------------------------------ -->

### plural:

 > Syntax: `{{singular|plural}}`

```typescript
const APPLES = '{nrOfApples} {{apple|apples}}'

LLL(APPLES, { nrOfApples: 1 }) // => '1 apple'
LLL(APPLES, { nrOfApples: 2 }) // => '2 apples'
```

<!-- ------------------------------------------------------------------------------------------ -->

### plural (shorthand):

 > Syntax: `{{plural}}`

```typescript
const APPLES = '{nrOfApples} apple{{s}}'

LLL(APPLES, { nrOfApples: 0 }) // => '0 apples'
LLL(APPLES, { nrOfApples: 1 }) // => '1 apple'
LLL(APPLES, { nrOfApples: 5 }) // => '5 apples'
```
<!-- ------------------------------------------------------------------------------------------ -->

### plural (shorthand for only singular version):

 > Syntax: `{{singular|}}`

```typescript
const MEMBERS = '{0} weitere{{s|}} Mitglied{{er}}'

LLL(MEMBERS, 0) // => '0 weitere Mitglieder'
LLL(MEMBERS, 1) // => '1 weiteres Mitglied'
LLL(MEMBERS, 9) // => '9 weitere Mitglieder'
```

### plural (zero, one, other):

 > Syntax: `{{zero|one|other}}`

```typescript
const LIST_ITEMS = 'The list includes {{ no items | an item | ?? items }}'

LLL(LIST_ITEMS, 0) // => 'The list includes no items'
LLL(LIST_ITEMS, 1) // => 'The list includes an item'
LLL(LIST_ITEMS, 12) // => 'The list includes 12 items'
```

### plural (inject passed argument):

 > Syntax: `{{singular|?? plural}}`

```typescript
const BANANAS = '{{ a banana | ?? bananas }}'

LLL(BANANAS, 1) // => 'a banana'
LLL(BANANAS, 3) // => '3 bananas'
```

### plural (full syntax):

Under the hood, `typesafe-i18n` uses the [Intl.PluralRules](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) for detecting the plural form.\
The only small modification made is, that the values `0` and `'0'` are always mapped to `'zero'` instead of `'other'`.

 > Syntax: `{{zero|one|two|few|many|other}}`

```typescript
// locale set to 'ar-EG'

const PLURAL = 'I have {{zero|one|two|a few|many|a lot}} apple{{s}}'

LLL(PLURAL, 0) // => 'I have zero apples'
LLL(PLURAL, 1) // => 'I have one apple'
LLL(PLURAL, 2) // => 'I have two apples'
LLL(PLURAL, 6) // => 'I have a few apples'
LLL(PLURAL, 18) // => 'I have many apples'
```

### plural (key reference):

Sometimes you may need to specify the key you want to use for defining the plural output.

 > Syntax: `{{key:[plural-syntax]}}`

```typescript
const BANANAS = 'banana{{nrOfBananas:s}}'

LLL(BANANAS, { nrOfBananas: 1 }) // => 'banana'
LLL(BANANAS, { nrOfBananas: 3 }) // => 'bananas'
```

<!-- ------------------------------------------------------------------------------------------ -->

### format passed in arguments:

Read the [formatters](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/formatters) section to learn how you can configure formatters.

```typescript
const now = Date.now()

LLL('Today is {date|weekday}', { date: now }) // => 'Today is Friday'
LLL('Heute ist {date|weekday}', { date: now }) // => 'Heute ist Freitag'
```

#### formatter chaining:

Allows also to format values by multiple formatters in row. The formatters will be called from left to right.

```typescript
const now = Date.now()

LLL('Today is {date|weekday}', { date: now }) // => 'Today is Friday'
LLL('Today is {date|weekday|uppercase}', { date: now }) // => 'Today is FRIDAY'
LLL('Today is {date|weekday|uppercase|shorten}', { date: now }) // => 'Today is FRI'
```

<!-- ------------------------------------------------------------------------------------------ -->

### Switch-Case

In some situations you may need to output a different sentence based on some argument. For such use-cases you can take advantage of the `switch-case` syntax.

> Syntax: {key | {case1: value1, case2: value2, *: defaultValue}}

Here is an example how the `switch-case` functionality can be used to output a person related sentence. Depending on the gender of the subject, a different wording is used:

```typescript
const translations: Translation {
   photoAdded: '{username:string} added a new photo to {gender|{male: his, female: her, *: their}} stream.'
}

LL.photoAdded({ username: 'John', gender: 'male' })
// => 'John added a new photo to his stream.'
LL.photoAdded({ username: 'Jane', gender: 'female' })
// => 'Jane added a new photo to her stream.'
LL.photoAdded({ username: 'Alex', gender: 'other' })
// => 'Alex added a new photo to their stream.'
```

Other use-cases could be e.g. yes-no options:

```typescript
const translations: Translation {
   tax: 'Price: ${price:number}. {taxes|{yes: An additional tax will be collected. , no: No taxes apply.}}'
}

LL.tax({ price: '999', taxes: 'yes' })
// => 'Price: $999. An additional tax will be collected.'
LL.tax({ price: '99', taxes: 'no' })
// => 'Price: $99. No taxes apply.'
```

You can define as many cases as you want.\
Each case must be split by a comma (`,`).\
Each case must contain a key and a value, where key and value are split by a colon (`:`).\
If you want to define a default-case you have to use an asterisk (`*`) as a key.


<!-- ------------------------------------------------------------------------------------------ -->

### typesafe arguments:

 > Syntax: `{key:type}`

```typescript
const translation = {
   HI: 'Hello {name:string}'
}

LL.HI('John') // => ERROR: Argument of type 'string' is not assignable to parameter of type '{ name: string; }'.
LL.HI({ name: 'John' }) // => 'Hi John'
```

<!-- ------------------------------------------------------------------------------------------ -->

### text only:

Of course `typesafe-i18n` can handle that as well.

```typescript
LLL('Welcome to my site') // => 'Welcome to my site'
```

Or if you are using the [i18nObject (LL)](#i18nobject):

```html
<script>
   const translation = {
      LOGIN: 'login'
   }
<script>

<div>
   {LL.LOGIN()} <!-- => 'login' -->
</div>
```



<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Usage

If the provided wrappers don't fit your needs, you can use these raw functions to implement a custom i18n integration.
The `typesafe-i18n` package exports a few different objects you can use to localize your applications:

 - [i18nString (LLL)](#i18nstring): string interpolation for selected parts of an application
 - [i18nObject (LL)](#i18nobject): for frontend-applications or projects that only load a single locale per user
 - [i18n (L)](#i18n): for APIs or backend-applications that need to handle multiple locales

### `i18nString`

The `i18nString` contains the core of the internationalization engine. To initialize it, you need to pass your desired `locale` and the `formatters` (optional) you want to use.\
You will get an object back that can be used to transform your translation strings.

> It is recommended to use the `typesafeI18nString` since it can analyze your translations and show error messages if you call them in a wrong way. Learn more in the [typesafety](#typesafety) section.

```typescript
import { i18nString } from 'typesafe-i18n'
// or
// import { typesafeI18nString } from 'typesafe-i18n'

const locale = 'en'
const formatters = {
   uppercase: (value) => value.toUpperCase()
}

const LLL = i18nString(locale, formatters)

LLL('Hello {name|uppercase}!', { name: 'world' }) // => 'Hello WORLD!'
```

### `i18nObject`

The `i18nObject` wraps your translations for a certain locale. To initialize it, you need to pass your desired `locale`, your `translations`-object and the `formatters` (optional) you want to use.\
You will get an object back that can be used to access and apply your translations.

> It is recommended to use the `typesafeI18nObject` since it can analyze your translations and show error messages if you call them in a wrong way. Learn more in the [typesafety](#typesafety) section.
>
```typescript
import { i18nObject } from 'typesafe-i18n'
// or
// import { typesafeI18nObject } from 'typesafe-i18n'

const locale = 'en'
const translations = {
   HI: 'Hello {name}!',
   RESET_PASSWORD: 'reset password'
   /* ... */
}
const formatters = { /* ... */ }

const LL = i18nObject(locale, translations, formatters)

LL.HI({ name: 'world' }) // => 'Hello world!'
LL.RESET_PASSWORD() // => 'reset password'
```

> See [here](#dictionary) how you can structure your dictionary object.


### `i18n`

Wrap all your locales with `i18n`. To initialize it, you need to pass a callback to get the `translations`-object for a given locale and a callback to initialize the `formatters` you want to use (optional).\
You will get an object back that can be used to access all your locales and apply your translations.


```typescript
import { i18n } from 'typesafe-i18n'

type Locales = 'en' | 'de' | 'it'

const localeTranslations = {
   en: { TODAY: 'Today is {date|weekday}' },
   de: { TODAY: 'Heute ist {date|weekday}' },
   it: { TODAY: 'Oggi è {date|weekday}' },
}

const initFormatters = (locale: Locales) => {
   const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long' })

   return {
      weekday: (value: Date | number) => dateFormatter.format(value),
   }
}

const formatters = {
   en: initFormatters('en'),
   de: initFormatters('de'),
   it: initFormatters('it'),
}

const L = i18n(localeTranslations, formatters)

const now = new Date()

L.en.TODAY({ date: now }) // => 'Today is friday'
L.de.TODAY({ date: now }) // => 'Heute ist Freitag'
L.it.TODAY({ date: now }) // => 'Oggi è venerdì'
```

A good usecase for this object could be inside your API, when your locale is dynamic e.g. derived from a users session:

```typescript
function doSomething(session) {

   /* ... */

   const locale = session.language
   return L[locale].SUCCESS_MESSAGE()
}

```

## Typesafety

Like the name `typesafe-i18n` already suggests, this i18n library can provide you a lot of typesafety features. So whenever you can, you should use the `typesafeI18nString` and `typesafeI18nObject` to translate your application. Just by passing the message with the [`typesafe-i18n` syntax](#syntax) to the translation function, `TypeScript` is able to parse it and provide you with typesafety.

### `typesafeI18nString`
```ts
const formatters = {
   uppercase: (value: string) => value.toUpperCase()
}

const LLL = typesafeI18nString('en', formatters)

LLL('I said: {value:string|uppercase}', { value: 'Hello' }) // => 'I said: HELLO'

LLL('I said: {value:string|uppercase}') // => ERROR: Expected 2 arguments, but got 1
LLL('I said: {value:string|uppercase}', 'Hello') // => ERROR: Argument of type 'string' is not assignable ...
LLL('I said: {value:string|uppercase}', { }) // => ERROR: Argument ... is not assignable ...
LLL('I said: {value:string|uppercase}', { someValue: 'Hello' }) // => ERROR: Argument ... is not assignable ...
LLL('I said: {value:string|uppercase}', { value 123 }) // => ERROR: Type 'number is not assignable to type 'string'
LLL('I said: {value:string|lowercase}', { value: 'HELLO' }) // => ERROR: unknown Formatter 'lowercase'
```

### `typesafeI18nObject`
```ts
const formatters = {
   uppercase: (value: string) => value.toUpperCase()
}

const translations = {
   photoAdded: 'Added a new photo to {gender|{male: his, female: her}} stream.',
} as const // ! important that you mark this 'as const', or else you won't get typesafety hints

const LL = typesafeI18nObject('en', translations)
```

### limitations

The `typesafeI18nString` and `typesafeI18nObject` functions offer full typesafety support, but these are things you need to know:

 - index based arguments need to be passed as an object:
   ```ts
   LLL('{0:number} {1}', { 0: 123, 1: 'test' })
   ```
 - optional arguments have to be passed as an empty object or as `undefined` if you don't want to render them
   ```ts
   LLL('I am {value?:string}', { })
   LLL('I am {value?:string}', { value: undefined })
   ```
 - you can only use a set of predefined `TypeScript` types. Other types will be marked as `unknown` so any value is allowed to be passed as an argument:
    ```ts
   LLL('{value:Project}', { value: 123 })
   LLL('{value:Project}', { value: 'MyProject' })
   ```

### more typesafety features

In order to get full typechecking support, you should use the exported functions in `i18n-util.ts` created by the [generator](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#generator). It contains fully typed wrappers for the following core functionalities.


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Dictionary

You are really flexible how you want to define your translations. You could define them:

 - as key-value pairs:
   ```typescript
   const en: BaseTranslation = {
      HI: 'Hello',
      LOGIN: 'click here to login'
      LOGOUT: 'logout'
   }
   ```
   > keys can also be lowercase

 - as nested key-value pairs **(recommended)**:
   ```typescript
   const en: BaseTranslation = {
      hi: 'Hello',
      auth: {
         login: 'click here to login'
         logout: 'logout'
      }
   }
   ```
   > can be nested as deep as you want. The only restriction is that you can't use the '.' character for your translation keys.

 - as an array:
   ```typescript
   const en: BaseTranslation = [
      'Hello',
      'click here to login'
      'logout'
   ]
   ```

 - as a nested array:
   ```typescript
   const en: BaseTranslation = [
      'Hello',
      [
         'click here to login'
         'logout'
      ]
   ]
   ```
   > can be nested as deep as you want

 - mixed:
   ```typescript
   const en: BaseTranslation = {
      HI: 'Hello',
      auth: [
         {
            login: 'click here to login'
         },
         'logout'
      ]
   }
   ```

You are really flexible how you define your translations. You can define the translations how it fits best to your application and i18n workflow.
It is recommended to use `nested key-value pairs` since it offers flexibility and is easy to read, but if your translations come from an external service like a CMS, it is possible that you also have to use the array syntax to define your translations.

> There is a small limitation when it comes to naming your keys. Due to `JavaScript` and some reserved keywords, you can't use `'length'`, `'caller'`, `'callee'` and `'arguments'` as keys inside your dictionary.

### arrays:

Here are some examples how you can iterate over arrays coming from a `typesafe-i18n` dictionary:

```html
<script>
   const translation = [
      'first item',
      'second item'
   ]

   // calling translation
   console.log(LL[0]()) // => 'first item'

   // get length of array
   const length = Array.from(LL).length

   // for loop
   for (let i = 0; i < Array.from(LL).length; i++) {
      console.log(LL[i]())
   }

   // forEach loop
   Array.from(LL).forEach((entry) => {
      console.log(entry())
   })

   // for of loop
   for (const entry of LL) {
      console.log(entry())
   }

   // for in loop
   for (const entry in LL7) {
      console.log(LL[entry]())
   }
<script>
```
