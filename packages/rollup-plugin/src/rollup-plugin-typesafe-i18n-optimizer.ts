import type { AcornNode, Plugin } from 'rollup'
import type {
	BaseNode,
	SimpleLiteral,
	ImportDeclaration,
	Identifier,
	Property,
	VariableDeclarator,
	ArrayExpression,
} from 'estree'
import { GeneratorConfig, getConfigWithDefaultValues } from '../../generator/src/generate-files'
import { createFilter } from '@rollup/pluginutils'
import { walk } from 'estree-walker'
import { partsAsStringWithoutTypes } from '../../core/src/core-utils'
import { parseRawText } from '../../core/src/parser'
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
const isVariableDeclaratorNode = <T extends BaseNode>(node: T): node is VariableDeclarator =>
	node.type === 'VariableDeclarator'

//@ts-ignore
const isIdentifierNode = <T extends BaseNode>(node: T): node is Identifier => node.type === 'Identifier'

//@ts-ignore
const isArrayExpressionNode = <T extends BaseNode>(node: T): node is ArrayExpression => node.type === 'ArrayExpression'

//@ts-ignore
const isPropertyNode = <T extends BaseNode>(node: T): node is Property => node.type === 'Property'

const createTranslationImportReplacementNode = (key: string) =>
	createTranslationReplacementNode({
		type: 'Identifier',
		name: key,
	})

const createTranslationMappingReplacementNode = (key: string) =>
	createTranslationReplacementNode({
		type: 'Literal',
		value: 'key',
		raw: `'${key}'`,
	})

const createTranslationReplacementNode = (key: SimpleLiteral | Identifier): Property => ({
	type: 'Property',
	method: false,
	shorthand: false,
	computed: false,
	key,
	kind: 'init',
	value: {
		type: 'Literal',
		raw: 'null',
		value: null,
	},
})

// eslint-disable-next-line no-console
const log = (...messages: unknown[]) => void console.info('[typesafe-i18n] optimizer:', ...messages)

const removeLocales = (ast: AcornNode, locales: string[], baseLocale: string) =>
	walk(ast, {
		enter(node) {
			if (isVariableDeclaratorNode(node) && isIdentifierNode(node.id)) {
				// set correct baseLocale
				if (node.id.name === 'baseLocale') {
					const literalNode = node.init as SimpleLiteral
					if (isLiteralNode(literalNode) && literalNode.value !== baseLocale) {
						const oldLocale = literalNode.value

						literalNode.value = baseLocale
						literalNode.raw = `"${baseLocale}"`

						return log(`changed base locale from '${oldLocale}' to '${baseLocale}'`)
					}
				}

				// remove locales from array
				if (node.id.name === 'locales') {
					const arrayExpressionNode = node.init as ArrayExpression
					if (isArrayExpressionNode(arrayExpressionNode)) {
						const toRemove = arrayExpressionNode.elements
							.filter(isLiteralNode)
							.map(({ value }) => value as string)
							.filter((locale) => !locales.includes(locale))

						arrayExpressionNode.elements = arrayExpressionNode.elements
							.filter(isLiteralNode)
							.filter(({ value }) => locales.includes(value as string))

						return log(`removed locales '${toRemove.join(',')}' from bundle`)
					}
				}
			}

			// remove locale import
			if (
				isImportDeclarationNode(node) &&
				node.specifiers.length === 1 &&
				node.specifiers[0]?.type === 'ImportDefaultSpecifier'
			) {
				const locale = ('' + node.source.value).substring(2)
				if (!locales.includes(locale)) {
					this.replace(createTranslationImportReplacementNode(node.specifiers[0]?.local.name))

					return log('[typesafe-i18n] optimizer:', `removed locale import '${locale}'`)
				}
			}

			// remove locale from translations
			if (
				isPropertyNode(node) &&
				node.kind === 'init' &&
				!node.method &&
				!node.computed &&
				(isIdentifierNode(node.key) || isLiteralNode(node.key)) &&
				isIdentifierNode(node.value)
			) {
				const key = isIdentifierNode(node.key) ? node.key.name : (node.key.value as string)

				if (!locales.includes(key)) {
					this.replace(createTranslationMappingReplacementNode(key))

					return log('[typesafe-i18n] optimizer:', `removed locale from translations '${key}'`)
				}
			}

			return
		},
	})

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const plugin = (config?: GeneratorConfig): Plugin => {
	let filterForBaseLocale: (id: unknown) => boolean
	let filterForUtilFile: (id: unknown) => boolean = () => false
	let locales: string[]
	let locale: string

	const initFilters = async () => {
		const configWithDefaultValues = await getConfigWithDefaultValues(config)

		const { outputPath, baseLocale, utilFileName } = configWithDefaultValues
		locales = configWithDefaultValues.locales
		locale = (locales.length && locales.includes(baseLocale) ? baseLocale : locales[0]) || baseLocale

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
			isUtilFile && removeLocales(ast, locales, locale)

			const map = new sourceMap.SourceMapGenerator({ file: id })
			const formattedCode = generate(ast, { sourceMap: map })
			return { code: formattedCode, map: map.toString() }
		},
	}
}

export default plugin
