# typesafe-i18n Node.js

This is a small project demonstrating a `typesafe-i18n` integration with Node.js.

> This is a small example express server.


## Get started

Start the server in development mode:

```bash
npm run dev
```

Navigate to [http://localhost:3001](http://localhost:3001). You should see the example app running.

# Overview
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-nodejs-project)
 - [available exports](#exports)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

# Configure `typesafe-i18n` for an existing Node.js project

First, you need to configure the watcher to listen for changes in your locales files.
For this you can add following line to the scripts-section of your `package.json` file.

```json
{

   ...

   "scripts": {
      "typesafe-i18n-watcher": "node ./node_modules/typesafe-i18n/node/watcher.js"
   }
}
```

Create the `.typesafe-i18n.json` config file in your projects root folder and specify `'node'` as [adapter](https://github.com/ivanhofer/typesafe-i18n#adapter).\
If you are running a node server it makes also sense to set the `loadLocalesAsync` [option](https://github.com/ivanhofer/typesafe-i18n#options) to false:

```json
{
	"adapter": "node",
	"loadLocalesAsync": false
}
```

The watcher will generate some custom utils inside `i18n-node.ts`.

That's it. You can then start using `typesafe-i18n` inside your application.

```typescript
import L from './i18n/i18n-node'

console.log(L.en.HI({ name: 'Node.js' })) // Hello Node.js!
```


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## exports

The file `i18n-node.ts` exports following function:

### L

An object of type [i18n](https://github.com/ivanhofer/typesafe-i18n#i18n) you can use inside your code.\
This is also the default object of that file.