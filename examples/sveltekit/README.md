# typesafe-i18n SvelteKit

This is a small project demonstrating a `typesafe-i18n` integration with SvelteKit.

## Get started

Run the SvelteKit dev server and `typesafe-i18n` in parallel:

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000). You should see the example app running.

# Overview
 - [add `typesafe-i18n` to existing projects](#configure-typesafe-i18n-for-an-existing-sveltekit-project)
 - [available Svelte stores](#svelte-stores)


<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

# Configure `typesafe-i18n` for an existing SvelteKit project

Configure `typesafe-i18n` by creating the file `.typesafe-i18n.json` with following contents:

```json
{
   "$schema": "https://unpkg.com/typesafe-i18n@2.46.5/schema/typesafe-i18n.json",

   "adapter": "svelte"
}
```

Run the generator e.g. by adding a new script inside your `package.json` file.
You could configure your development script to run the generator in parallel to `svelte-kit dev`.

```json
{
   "scripts": {
      "dev": "npm-run-all --parallel sveltekit typesafe-i18n",
      "typesafe-i18n": "typesafe-i18n",
      "sveltekit": "svelte-kit dev",
   }
}
```

The generator will create some custom Svelte stores inside `i18n-svelte.ts` that you can use inside your components.

Then inside your `routes/__layout.svelte` file, you need to call `initI18n` inside the `load` function in order to setup all stores.

```html
<script context="module">
   import LL, { initI18n, setLocale } from '../i18n/i18n-svelte';

   export async function load({ page, fetch, session, context }) {
   // detect locale of user (see https://github.com/ivanhofer/typesafe-i18n#locale-detection)
   const locale = 'en'
      await initI18n(locale)

      return {}
   }
</script>
```

That's it. You can then start using `typesafe-i18n` inside your SvelteKit application.

```html
<script lang="ts">
   import LL from './i18n/i18n-svelte'
</script>

<h1>{$LL.HELLO({ name: 'SvelteKit' })}</h1> <!-- "Hello SvelteKit!" -->
```

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Svelte Stores

See [here](https://github.com/ivanhofer/typesafe-i18n/tree/main/examples/svelte#stores) for more information.

---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**
