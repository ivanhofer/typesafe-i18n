# typesafe-i18n Node.js

This is a small project demonstrating a `typesafe-i18n` integration with Node.js.

> This is a small example express server.


## Get started

Start the server in development mode:

```bash
npm run dev
```

Navigate to [http://localhost:3001](http://localhost:3001). You should see the example app running.

---

## Overview
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-nodejs-project)
 - [available exports](#exports)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Configure `typesafe-i18n` for an existing Node.js project

> requires a node version >= 12.x

Initialize `typesafe-i18n` by running

```bash
npx typesafe-i18n --setup-auto
```

You could configure your development script to run the generator in parallel to `nodemon` by using [`npm-run-all`](https://github.com/mysticatea/npm-run-all).

```json
{
   "scripts": {
		"dev": "npm-run-all --parallel nodemon typesafe-i18n",
		"nodemon": "nodemon src/index.ts",
		"typesafe-i18n": "typesafe-i18n"
   }
}
```

The generator will create some custom utils inside `i18n-node.ts`.

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


---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**