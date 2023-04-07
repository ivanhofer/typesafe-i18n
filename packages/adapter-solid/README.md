# `typesafe-i18n` Solid

**You can find a demo implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-solid/example).**

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

---

## Table of Contents
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-solidjs-project)
 - [generated component & context](#generated-component--context)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Configure `typesafe-i18n` for an existing SolidJS project


Initialize `typesafe-i18n` by running

```bash
npx typesafe-i18n --setup-auto
```

You could configure your development script to run the generator in parallel to `vite` by using [`npm-run-all`](https://github.com/mysticatea/npm-run-all).

```json
{
   "scripts": {
      "dev": "npm-run-all --parallel vite typesafe-i18n",
      "typesafe-i18n": "typesafe-i18n",
      "vite": "vite"
   }
}
```

The generator will create a custom SolidJS component and context inside `i18n-solid.tsx` that you can use inside your application.

Wrap your application root with the `TypesafeI18n` component:

```jsx
import { Component } from 'solid-js'
import TypesafeI18n from './i18n/i18n-solid'

const App: Component = () => {

   // TODO: load locales (https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#loading-locales)
   // e.g. take a look at the example implementation (https://github.com/ivanhofer/typesafe-i18n/blob/main/packages/adapter-solid/example/src/App.tsx#L14)

   return (
      <TypesafeI18n locale="en">

         <!-- your app goes here -->

      </TypesafeI18n>
   )
}

export default App
```

That's it. You can then start using `typesafe-i18n` inside your SolidJS components.

```jsx
import { useI18nContext } from './i18n/i18n-solid'

function Greeting(props: { name: string }) {
   const { LL } = useI18nContext()

   return <h1>{LL().HI({ name: props.name })}</h1>
}

export default Greeting
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## generated component & context

### TypesafeI18n

When running the [generator](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#generator), the file `i18n-solid.tsx` will export a Solid component you can wrap around your application. It requires the prop `locale` where you need to pass a locale to initialize the context.

```jsx
import { Component } from 'solid-js'
import TypesafeI18n from './i18n/i18n-solid'

const App: Component = () => {

   // TODO: load locales (https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#loading-locales)
   // e.g.
   // const locale = 'en'
   // loadLocaleAsync(locale).then(() => setLocale(locale))

   return (
      <TypesafeI18n locale="en">

         <!-- your app goes here -->

      </TypesafeI18n>
   )
}

export default App
```


### useI18nContext

Also a SolidJs context is exported by the generated file `i18n-solid.tsx`. You can use it with the `useI18nContext` function.

```jsx
import { useI18nContext } from './i18n/i18n-solid'

function MyComponent(props) {
   const { LL, locale, setLocale } = useI18nContext()

   return // ...
}

export default MyComponent
```

The context gives you access to following variables:

#### LL

An initialized [`i18nObject`](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/runtime#i18nObject) you can use to translate your app.

```jsx
import { useI18nContext } from './i18n/i18n-solid'

function ProjectOverview() {
   const { LL } = useI18nContext()

   return LL().NR_OF_PROJECTS(5) // will output e.g => '5 Projects'
}

export default ProjectOverview
```

#### locale

A `string` containing the current selected locale.

#### setLocale

A function to set another locale for the context.


```jsx
import { useI18nContext } from './i18n/i18n-solid'

function LanguageSelection() {
   const { locale, setLocale } = useI18nContext()

   return (
      <ul className="language-selection">
         <li className={'en' === locale() ? 'selected' : ''} onClick={() => setLocale('en')}>
            english
         </li>
         <li className={'de' === locale() ? 'selected' : ''} onClick={() => setLocale('de')}>
            deutsch
         </li>
         <li className={'it' === locale() ? 'selected' : ''} onClick={() => setLocale('it')}>
            italiano
         </li>
      </ul>
   )
}

export default LanguageSelection
```


---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**