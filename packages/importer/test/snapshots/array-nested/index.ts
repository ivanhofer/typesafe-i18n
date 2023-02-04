/* eslint-disable */
import type { Translation } from '../i18n-types'

const array_nested = {
	'0': {
		'0': 'a',
		'1': 'b',
		'2': 'c',
	},
	'1': 'b',
	'2': {
		'0': 'c',
		'1': {
			'0': 'e',
			'1': 'f',
		},
	},
} satisfies Translation

export default array_nested
