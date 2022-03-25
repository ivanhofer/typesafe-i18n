import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
	HI: 'Hello {name:string}!',
	INSTRUCTIONS_LOCALE:
		'Please navigate to "http://localhost:3001/:locale", where ":locale" is one of following: "en", "de" or "it" e.g. <a href="http://localhost:3001/en">http://localhost:3001/en</a>',
	INSTRUCTIONS_NAME:
		'Please navigate to "http://localhost:3001/en/:name", where ":name" is your name e.g. <a href="http://localhost:3001/en/John">http://localhost:3001/en/John</a>',
}

export default en
