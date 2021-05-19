module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '806 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '856 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.min.js',
		limit: '960 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1013 b',
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.js',
		limit: '1104 b',
		ignore: ['svelte'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.js',
		limit: '1080 b',
		ignore: ['react'],
	},
]
