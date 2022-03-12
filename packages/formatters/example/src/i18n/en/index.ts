import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
	locale: {
		choose: 'Choose locale:',
		selected: 'Selected locale:',
	},
	custom: `For input '{0:number}' I get '{0|custom}' as a result`,
	chaining: `Result: {0:number|sqrt|round}`,
	builtin: {
		date: 'Today is {0:Date|weekday}',
		time: 'Next meeting: {0:Date|timeShort}',
		number: 'Your balance is {0:number|currency}',
		replace: 'The link is: https://www.xyz.com/{0:string|noSpaces}',
		'identity-and-ignore': 'Hello {name|myFormatter}',
		uppercase: 'I said: {0:string|upper}',
		lowercase: 'He said: {0:string|lower}',
	}
}

export default en
