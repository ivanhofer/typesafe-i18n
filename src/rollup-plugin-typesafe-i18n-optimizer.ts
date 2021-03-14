import type { AcornNode, Plugin } from 'rollup'
import type { BaseNode, SimpleLiteral } from 'estree'
import type { GeneratorConfig } from './generator/generator'
import { createFilter } from '@rollup/pluginutils'
import { walk } from 'estree-walker'
import { partsAsStringWithoutTypes } from './core/core-utils'
import { parseRawText } from './core/parser'
import { generate } from 'astring'
import sourceMap from 'source-map'

//@ts-ignore
const filterLiteralNode = <T extends BaseNode>(node: T): node is SimpleLiteral => node.type === 'Literal'

const removeTypesFromStrings = (ast: AcornNode) =>
	walk(ast, {
		enter(node) {
			if (!filterLiteralNode(node)) return

			const parts = parseRawText(node.value as string, false)
			const withoutTypes = partsAsStringWithoutTypes(parts)

			this.replace({ type: 'Literal', value: withoutTypes } as SimpleLiteral)
		},
	})

const plugin = (config?: Pick<GeneratorConfig, 'baseLocale'>): Plugin => {
	const baseLocale = config?.baseLocale || 'en'
	const filter = createFilter([`./src/i18n/${baseLocale}/index.ts`])

	return {
		name: 'rollup-plugin-typesafe-i18n-optimizer',
		transform(code, id) {
			if (!filter(id)) return

			const ast = this.parse(code)

			removeTypesFromStrings(ast)

			const map = new sourceMap.SourceMapGenerator({ file: id })
			const formattedCode = generate(ast, { sourceMap: map })
			return { code: formattedCode, map: map.toString() }
		},
	}
}

export default plugin
