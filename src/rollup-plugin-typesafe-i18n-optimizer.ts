import type { AcornNode, Plugin } from 'rollup'
import type { BaseNode, SimpleLiteral, ImportDeclaration, Identifier, Property } from 'estree'
import { GeneratorConfig, setDefaultConfigValuesIfMissing } from './generator/generator'
import { createFilter } from '@rollup/pluginutils'
import { walk } from 'estree-walker'
import { partsAsStringWithoutTypes } from './core/core-utils'
import { parseRawText } from './core/parser'
import { generate } from 'astring'
import sourceMap from 'source-map'

//@ts-ignore
const isLiteralNode = <T extends BaseNode>(node: T): node is SimpleLiteral => node.type === 'Literal'

const removeTypesFromStrings = (ast: AcornNode) =>
	walk(ast, {
		enter(node) {
			if (!isLiteralNode(node)) return

			const parts = parseRawText(node.value as string, false)
			const withoutTypes = partsAsStringWithoutTypes(parts)

			this.replace({ type: 'Literal', value: withoutTypes } as SimpleLiteral)
		},
	})

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

//@ts-ignore
const isImportDeclarationNode = <T extends BaseNode>(node: T): node is ImportDeclaration =>
	node.type === 'ImportDeclaration'

//@ts-ignore
const isIdentifierNode = <T extends BaseNode>(node: T): node is Identifier => node.type === 'Identifier'

//@ts-ignore
const isPropertyNode = <T extends BaseNode>(node: T): node is Property => node.type === 'Property'

const removeLocales = (ast: AcornNode, locales: string[]) =>
	walk(ast, {
		enter(node) {
			// remove locale import
			if (
				isImportDeclarationNode(node) &&
				node.specifiers.length === 1 &&
				node.specifiers[0]?.type === 'ImportDefaultSpecifier'
			) {
				const locale = ('' + node.source.value).substring(2)
				if (!locales.includes(locale)) {
					this.remove()
				}
				return
			}

			// remove locale from tranlsations
			if (
				isPropertyNode(node) &&
				node.kind === 'init' &&
				!node.method &&
				!node.computed &&
				isIdentifierNode(node.key) &&
				isIdentifierNode(node.value)
			) {
				if (!locales.includes(node.key.name)) {
					this.remove()
				}
			}
		},
	})

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const plugin = (config?: GeneratorConfig): Plugin => {
	let filterForBaseLocale: (id: unknown) => boolean
	let filterForUtilFile: (id: unknown) => boolean = () => false
	let locales: string[]

	const initFilters = async () => {
		const configWithDefaultValues = await setDefaultConfigValuesIfMissing(config)

		const { outputPath, baseLocale, utilFileName } = configWithDefaultValues
		locales = configWithDefaultValues.locales

		filterForBaseLocale = createFilter([`${outputPath}/${baseLocale}/index.ts`])
		locales.length && (filterForUtilFile = createFilter([`./${outputPath}/${utilFileName}.ts`]))
	}

	initFilters()

	return {
		name: 'rollup-plugin-typesafe-i18n-optimizer',
		transform(code, id) {
			const isBaseLocale = filterForBaseLocale(id)
			const isUtilFile = filterForUtilFile(id)
			if (!isBaseLocale && !isUtilFile) return

			const ast = this.parse(code)

			isBaseLocale && removeTypesFromStrings(ast)
			isUtilFile && removeLocales(ast, locales)

			const map = new sourceMap.SourceMapGenerator({ file: id })
			const formattedCode = generate(ast, { sourceMap: map })
			return { code: formattedCode, map: map.toString() }
		},
	}
}

export default plugin
