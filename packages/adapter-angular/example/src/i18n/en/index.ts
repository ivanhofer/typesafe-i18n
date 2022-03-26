import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
	STARTUP: 'app started',
	CHOOSE_LOCALE: 'choose locale...',
	HI: 'Hello {name:string}!',
	YOUR_NAME: 'Your name:',
	SELECTED_LOCALE: 'Selected locale:',
	TODAY: 'Today is {date:Date|weekday}',
	APPLES_LABEL: 'Apples',
	BANANAS_LABEL: 'Bananas',
	FRUITS: 'I want to buy {nrOfApples:number|fallback0} apple{{s}} and {nrOfBananas:number|fallback0} banana{{s}}.',
}

export default en
