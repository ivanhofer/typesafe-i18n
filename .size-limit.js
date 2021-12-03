module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '978 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1071 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.min.js',
		limit: '1108 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1169 b',
	},
	{
		name: 'angular-adapter',
		path: 'angular/angular-service.min.cjs',
		limit: '1405 b',
		ignore: ['angular'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.cjs',
		limit: '1564 b',
		ignore: ['react'],
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.cjs',
		limit: '1543 b',
		ignore: ['svelte'],
	},

]
