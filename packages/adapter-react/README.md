# `typesafe-i18n` React

**You can find a demo react implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-react/examples/react).**

**You can find a demo Next.js implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-react/examples/nextjs).**

**You can find a demo Expo react-native implementation [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/adapter-react/examples/expo).**

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

---

## Table of Contents
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-react-project)
 - [generated component & context](#generated-component--context)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Configure `typesafe-i18n` for an existing React project


Initialize `typesafe-i18n` by running

```bash
npx typesafe-i18n --setup-auto
```

You could configure your development script to run the generator in parallel to `react-scripts start` by using [`npm-run-all`](https://github.com/mysticatea/npm-run-all).

```json
{
   "scripts": {
      "dev": "npm-run-all --parallel start typesafe-i18n",
      "typesafe-i18n": "typesafe-i18n",
      "start": "react-scripts start"
   }
}
```

The generator will create a custom React component and context inside `i18n-react.tsx` that you can use inside your application.

Wrap your application root with the `TypesafeI18n` component:

```jsx
import React from 'react'
import TypesafeI18n from './i18n/i18n-react'

function App() {

   // TODO: load locales (https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#loading-locales)

   return (
      <TypesafeI18n locale="en">

         <!-- your app goes here -->

      </TypesafeI18n>
   )
}

export default App
```

That's it. You can then start using `typesafe-i18n` inside your React components.

```jsx
import React from 'react'
import { useI18nContext } from './i18n/i18n-react'

function Greeting(props) {
   const { LL } = useI18nContext()

   return <h1>{LL.HI({ name: props.name })}</h1>
}

export default Greeting
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## generated component & context

### TypesafeI18n

When running the [generator](https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#generator), the file `i18n-react.tsx` will export a React component you can wrap around your application. It requires the prop `locale` where you need to pass a locale to initialize the context.

```jsx
import React from 'react'
import TypesafeI18n from './i18n/i18n-react'

function App() {

   // TODO: load locales (https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/generator#loading-locales)

   return (
      <TypesafeI18n locale="en">

         <!-- your app goes here -->

      </TypesafeI18n>
   )
}

export default App
```


### useI18nContext

Also a React context is exported by the generated file `i18n-react.tsx`. You can use it with the `useI18nContext` function.

```jsx
import React from 'react'
import { useI18nContext } from './i18n/i18n-react'

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
import React from 'react'
import { useI18nContext } from './i18n/i18n-react'

function ProjectOverview() {
   const { LL } = useI18nContext()

   return LL.NR_OF_PROJECTS(5) // will output e.g => '5 Projects'
}

export default ProjectOverview
```

#### locale

A `string` containing the current selected locale.

#### setLocale

A function to set another locale for the context.


```jsx
import React from 'react'
import { useI18nContext } from './i18n/i18n-react'

function LanguageSelection() {
   const { locale, setLocale } = useI18nContext()

   return (
      <ul className="language-selection">
         <li className={'en' === locale ? 'selected' : ''} onClick={() => setLocale('en')}>
            english
         </li>
         <li className={'de' === locale ? 'selected' : ''} onClick={() => setLocale('de')}>
            deutsch
         </li>
         <li className={'it' === locale ? 'selected' : ''} onClick={() => setLocale('it')}>
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