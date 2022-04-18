import type { Translation } from '../i18n-types'

const de: Translation = {
	HI: 'Hallo {name}!',
	INSTRUCTIONS_LOCALE:
		'Bitte navigieren Sie zu "http://localhost:3001/:locale", wobei ":locale" eines der folgenden ist: "en", "de" oder "it" z.B. <a href="http://localhost:3001/de">http://localhost:3001/de</a>',
	INSTRUCTIONS_NAME:
		'Bitte navigieren Sie zu "http://localhost:3001/de/:name", wobei ":name" Ihr Name ist z.B. <a href="http://localhost:3001/de/Max">http://localhost:3001/de/Max</a>',
}

export default de
