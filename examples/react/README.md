# typesafe-i18n React

This is a small project demonstrating a `typesafe-i18n` integration with React.

> This repository was set up using [Create React App](https://github.com/facebook/create-react-app) with the typescript option.


## Get started

Start the project in development mode:

```bash
npm run dev
```

Navigate to [http://localhost:4000](http://localhost:4000). You should see the example app running.

# Overview
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-react-project)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

# Configure `typesafe-i18n` for an existing React project

Configure `typesafe-i18n` by creating the file `.typesafe-i18n.json` with following contents:

```json
{
   "adapter": "react"
}

```


Run the watcher e.g. by adding a new script inside your `package.json` file.
You could configure your development script to run the watcher in parallel to `react-scripts start`.

```json
// ... other options

"scripts": {
   "dev": "npm-run-all --parallel start typesafe-i18n-watcher",
   "typesafe-i18n-watcher": "node ./node_modules/typesafe-i18n/node/watcher.js",
   "start": "react-scripts start"
}
```

The watcher will generate a custom React context inside `i18n-react.ts` that you can use inside your components.

Inside your root component initialize the context:

```typescript
import React from 'react'
import I18nContext, { useI18n } from './i18n/i18n-react'

function App() {
   const i18n = useI18n()

   return (
      <I18nContext.Provider value={i18n}>

         <!-- your app goes here -->

      </I18nContext.Provider>
   )
}

export default App

```

That's it. You can then start using `typesafe-i18n` inside your React components.

```typescript
import React from 'react'
import I18nContext from './i18n/i18n-react'

function Greeting(props) {
   const { LL } = useContext(I18nContext)

   return <h1>{LL.HI({ name: props.name })}</h1>
}

export default Greeting


```