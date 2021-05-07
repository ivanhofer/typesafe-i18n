module.exports = [
	{
		name: 'i18n-string',
		path: 'dist/i18n.string.min.js',
		limit: '804 b',
	},
	{
		name: 'i18n-object',
		path: 'dist/i18n.object.min.js',
		limit: '858 b',
	},
	{
		name: 'i18n-instance',
		path: 'dist/i18n.min.js',
		limit: '962 b',
	},
	// {
	// 	name: 'i18n-loader',
	// 	path: 'dist/i18n.loader.min.js',
	// 	limit: '911 b',
	// },
	// {
	// 	name: 'i18n-loader-async',
	// 	path: 'dist/i18n.loader.async.min.js',
	// 	limit: '919 b',
	// },
	{
		name: 'all together',
		path: 'dist/i18n.all.min.js',
		limit: '1013 b',
	},
	{
		name: 'svelte-store',
		path: 'svelte/svelte-store.min.js',
		limit: '1102 b',
		ignore: ['svelte'],
	},
	{
		name: 'react-context',
		path: 'react/react-context.min.js',
		limit: '1081 b',
		ignore: ['react'],
	},
]
