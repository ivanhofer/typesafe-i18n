module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '938 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '1054 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.min.js',
		limit: '1092 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1154 b',
	},
	{
		name: 'angular-adapter',
		path: 'angular/angular-service.min.cjs',
		limit: '1360 b',
		ignore: ['angular'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.cjs',
		limit: '1545 b',
		ignore: ['react'],
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.cjs',
		limit: '1526 b',
		ignore: ['svelte'],
	},

]
