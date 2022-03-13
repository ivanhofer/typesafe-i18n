import type { Translation } from '../i18n-types'

const de: Translation = {
	locale: {
		choose: 'Sprache auswählen:',
		selected: 'Ausgewählte Sprache:',
	},
	custom: `Für die Eingabe '{0}' erhalte ich '{0|custom}' als Ergebnis`,
	chaining: `Ergebnis: {0|sqrt|round}`,
	builtin: {
		date: 'Heute ist {0|weekday}',
		time: 'Nächstes Meeting: {0|timeShort}',
		number: 'Dein Saldo beträgt {0|currency}',
		replace: 'Der Link lautet: https://www.xyz.com/{0|noSpaces}',
		'identity-and-ignore': 'Hallo {name|myFormatter}',
		uppercase: 'Ich sagte: {0|upper}',
		lowercase: 'Er sagte: {0|lower}',
	}
}

export default de
