# `typesafe-i18n` Browser

This is a small project demonstrating a `typesafe-i18n` integration with JavaScript in Browsers.

> This is a small example static webpage.


## Get started

Start serving files:

```bash
npm run dev
```

Navigate to [http://localhost:5000](http://localhost:5000). You should see the example app running.

---

<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------ -->

## Add `typesafe-i18n` for an existing JavaScript project

You can also use `typesafe-i18n` without its typesafety as a lightweight i18n package.

Load your desired function from the unpkg CDN and inject it into your HTML-code:

  - [i18nString](https://github.com/ivanhofer/typesafe-i18n#i18nString)
	```html
  	<script src="https://unpkg.com/typesafe-i18n@5.1.0/dist/i18n.string.min.js"></script>

	<script>
	   const LLL = i18n( /* i18nString parameters */ )

	   LLL('Hi {0}', 'John')
	</script>
  	```

  - [i18nObject](https://github.com/ivanhofer/typesafe-i18n#i18nObject)
  	```html
  	<script src="https://unpkg.com/typesafe-i18n@5.1.0/dist/i18n.object.min.js"></script>

	<script>
	   const LL = i18n( /* i18nObject parameters */ )

	   LL.HI('John')
	</script>
  	```

  - [i18n](https://github.com/ivanhofer/typesafe-i18n#i18n)

	```html
  	<script src="https://unpkg.com/typesafe-i18n@5.1.0/dist/i18n.min.js"></script>

	<script>
	   const L = i18n( /* i18n parameters */ )

	   L.en.HI('John')
	</script>
  	```

  - all together
  	```html
  	<script src="https://unpkg.com/typesafe-i18n@5.1.0/dist/i18n.all.min.js"></script>

	<script>
	   const LLL = i18n.initString( /* i18nString parameters */ )
	   const LL = i18n.initObject( /* i18nObject parameters */ )
	   const L = i18n.init( /* i18n parameters */ )
	</script>
  	```

---
---

**For more information about `typesafe-i18n`, take a look at the [main repository](https://github.com/ivanhofer/typesafe-i18n).**