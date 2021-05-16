// This types were auto-generated. Any manual changes will be overwritten.
/* eslint-disable */

import type { A, B } from './types-template.actual'

export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type TranslationKeys =
	| 'ORDER_INDEX'
	| 'ORDER_KEYED'
	| 'ORDER_FORMATTER'
	| 'ORDER_TYPES'

export type Translation = {
	/**
	 * {1} {0} {2} {0}
	 * @param {unknown} 0
	 * @param {unknown} 1
	 * @param {unknown} 2
	 */
	'ORDER_INDEX': RequiredParams4<'0', '0', '1', '2'>
	/**
	 * {b} {z} {a}
	 * @param {unknown} a
	 * @param {unknown} b
	 * @param {unknown} z
	 */
	'ORDER_KEYED': RequiredParams3<'a', 'b', 'z'>
	/**
	 * {0|z} {1|a}
	 * @param {unknown} 0
	 * @param {unknown} 1
	 */
	'ORDER_FORMATTER': RequiredParams2<'0|z', '1|a'>
	/**
	 * {0} {1}
	 * @param {B} 0
	 * @param {A} 1
	 */
	'ORDER_TYPES': RequiredParams2<'0', '1'>
}

export type TranslationFunctions = {
	/**
	 * {1} {0} {2} {0}
	 */
	'ORDER_INDEX': (arg0: unknown, arg1: unknown, arg2: unknown) => string
	/**
	 * {b} {z} {a}
	 */
	'ORDER_KEYED': (arg: { a: unknown, b: unknown, z: unknown }) => string
	/**
	 * {0|z} {1|a}
	 */
	'ORDER_FORMATTER': (arg0: unknown, arg1: unknown) => string
	/**
	 * {0} {1}
	 */
	'ORDER_TYPES': (arg0: B, arg1: A) => string
}

export type Formatters = {
	'a': (value: unknown) => unknown
	'z': (value: unknown) => unknown
}


type Param<P extends string> = `{${P}}`

type Params2<P1 extends string, P2 extends string> =
	`${string}${Param<P1>}${string}${Param<P2>}${string}`

type Params3<P1 extends string, P2 extends string, P3 extends string> =
	`${string}${Param<P1>}${string}${Param<P2>}${string}${Param<P3>}${string}`

type Params4<P1 extends string, P2 extends string, P3 extends string, P4 extends string> =
	`${string}${Param<P1>}${string}${Param<P2>}${string}${Param<P3>}${string}${Param<P4>}${string}`

type RequiredParams2<P1 extends string, P2 extends string> =
	| Params2<P1, P2>
	| Params2<P2, P1>

type RequiredParams3<P1 extends string, P2 extends string, P3 extends string> =
	| Params3<P1, P2, P3>
	| Params3<P1, P3, P2>
	| Params3<P2, P1, P3>
	| Params3<P2, P3, P1>
	| Params3<P3, P1, P2>
	| Params3<P3, P2, P1>

type RequiredParams4<P1 extends string, P2 extends string, P3 extends string, P4 extends string> =
	| Params4<P1, P2, P3, P4>
	| Params4<P1, P2, P4, P3>
	| Params4<P1, P3, P2, P4>
	| Params4<P1, P3, P4, P2>
	| Params4<P1, P4, P2, P3>
	| Params4<P1, P4, P3, P2>
	| Params4<P2, P1, P3, P4>
	| Params4<P2, P1, P4, P3>
	| Params4<P2, P3, P1, P4>
	| Params4<P2, P3, P4, P1>
	| Params4<P2, P4, P1, P3>
	| Params4<P2, P4, P3, P1>
	| Params4<P3, P1, P2, P4>
	| Params4<P3, P1, P4, P2>
	| Params4<P3, P2, P1, P4>
	| Params4<P3, P2, P4, P1>
	| Params4<P3, P4, P1, P2>
	| Params4<P3, P4, P2, P1>
	| Params4<P4, P1, P2, P3>
	| Params4<P4, P1, P3, P2>
	| Params4<P4, P2, P1, P3>
	| Params4<P4, P2, P3, P1>
	| Params4<P4, P3, P1, P2>
	| Params4<P4, P3, P2, P1>
