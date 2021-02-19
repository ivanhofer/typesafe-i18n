# typesafe-18n example for Svelte projects with TypeScript

> This is a clone from the [Svelte](https://svelte.dev) template (see https://github.com/sveltejs/template). The template was then converted to TypeScript.


## Get started

You will see how to configure `rollup.config.js` to listen for changes in your locales files.

```javascript

import i18nWatcher from 'typesafe-i18n/rollup/rollup-plugin-typesafe-i18n-watcher'

export default {
	input: ...,
	output: ...,
	plugins: [

		... // other plugins

		!production && i18nWatcher({ svelte: true, loadLocalesAsync: false }),

	],
}

```
---

Start [Rollup](https://rollupjs.org) in development mode:

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the app running.

---

Your locales files will be in `./src/i18n/[locale]/index.ts`.\
The base locale is set to `en`.\
When you are running the dev server and make some changes inside your base locale translation `./src/i18n/en/index.ts`, new types will be generated inside `./src/i18n/i18n-types.ts`.\
You will get typescript compile errors if some other locale translation does not match the base-translation.
