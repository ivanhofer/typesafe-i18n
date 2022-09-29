import { sortStringPropertyASC } from 'typesafe-utils'
import type { JsDocInfo, TypeInformation } from '../../types.mjs'

const addNonBreakingSpaceBetweenCharacters = (value: string) => value.split('').join('​')

const sanitizeText = (text: string) => text.replace(/\*\//g, '*\\/')

export const createJsDocsString = (
	{ text, types, pluralOnlyArgs }: JsDocInfo = {} as JsDocInfo,
	renderTypes = false,
	renderPluralOnlyArgs = true,
	renderNonBreakingSpaceBetweenCharacters = false,
) => {
	const renderedTypes = renderTypes
		? `${Object.entries(types || {})
				.filter(({ '0': key }) => renderPluralOnlyArgs || !pluralOnlyArgs.includes(key))
				.sort(sortStringPropertyASC('0'))
				.map(createJsDocsParamString)
				.join('')}`
		: ''

	const sanitizedText = sanitizeText(text)
	const textToDisplay = renderNonBreakingSpaceBetweenCharacters
		? addNonBreakingSpaceBetweenCharacters(sanitizedText)
		: sanitizedText

	return textToDisplay.length + renderedTypes.length
		? `/**
	 * ${textToDisplay}${renderedTypes}
	 */
	`
		: ''
}

const createJsDocsParamString = ([paramName, { types, optional }]: [string, TypeInformation]) => `
	 * @param {${types.join(' | ')}} ${optional ? `[${paramName}]` : paramName}`
