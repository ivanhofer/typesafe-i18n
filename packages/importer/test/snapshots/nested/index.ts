/* eslint-disable */
import type { Translation } from '../i18n-types'

const nested = {
	i: {
		am: {
			deeply: {
				nested: 'i am deeply nested',
			},
		},
		nested: 'i am nested',
	},
} satisfies Translation

export default nested
