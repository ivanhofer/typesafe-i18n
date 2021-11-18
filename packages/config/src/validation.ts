import Ajv, { AdditionalPropertiesParams, EnumParams, ErrorObject } from 'ajv'
import kleur from 'kleur'
import { inspect } from 'util'
//@ts-ignore
import schema from '../../../schema/typesafe-i18n.json'
import type { GeneratorConfig } from './types'
const validate = new Ajv({ allErrors: true }).compile(schema as object)

const formatMessage = ({ keyword, message, params, dataPath }: ErrorObject) => {
	const key = dataPath.substring(1)
	switch (keyword) {
		case 'additionalProperties':
			return `${message}: ${(params as AdditionalPropertiesParams).additionalProperty}`
		case 'enum':
			return `'${key}' ${message}: ${(params as EnumParams).allowedValues.map((v) => `'${v}'`).join(', ')}`
		case 'type':
			return `'${key}' ${message}`
	}

	return `'${key}' ${message}: ${inspect(params, false, 999)}`
}

const NEW_LINE = '\n - '
const getErrorMessage = (errors: ErrorObject[]) =>
	kleur.red(
		`
Your 'typesafe-i18n' config contains following errors:${NEW_LINE}${errors.map(formatMessage).join(NEW_LINE)}
`,
	) +
	kleur.yellow(`
See here for all available options: https://github.com/ivanhofer/typesafe-i18n#options
`)

// --------------------------------------------------------------------------------------------------------------------

export const validateConfig = async (config: GeneratorConfig) => {
	const valid = await validate(config)
	if (valid) return true

	throw new Error(getErrorMessage(validate.errors as ErrorObject[]))
}
