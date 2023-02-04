/* eslint-disable */
import type { Translation } from '../i18n-types'

const mixed = {
	'0': {
		a: 'b',
		c: {
			d: {
				e: 'test',
			},
		},
	},
	'1': {
		'0': 'c',
		'1': {
			'0': 'e',
			'1': 'f',
		},
	},
} satisfies Translation

export default mixed
