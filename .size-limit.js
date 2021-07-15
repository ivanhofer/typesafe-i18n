module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '806 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '911 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.min.js',
		limit: '1016 b',
	},
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1068 b',
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.js',
		limit: '1167 b',
		ignore: ['svelte'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.js',
		limit: '1184 b',
		ignore: ['react'],
	},
]
