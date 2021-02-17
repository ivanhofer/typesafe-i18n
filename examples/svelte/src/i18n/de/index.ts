import type { Translation } from '../i18n-types'

const de: Translation = {
	STARTUP: 'Anwendung wurde gestartet',
	CHOOSE_LOCALE: 'Sprache auswählen...',
	HI: 'Hallo {name}!',
	TUTORIAL: 'Besuche das {link|linkToSvelteTutorial} um zu erfahren, wie man Svelte Anwendungen entwickelt.',
	YOUR_NAME: 'Dein Name:',
	SELECTED_LOCALE: 'Ausgewählte Sprache:',
	TODAY: 'Heute ist {date|weekday}',
	APPLES_LABEL: 'Äpfel',
	BANANAS_LABEL: 'Bananen',
	FRUITS: 'Ich möchte gerne {nrOfApples|fallback0} {{Apfel|Äpfel}} und {nrOfBananas|fallback0} Banane{{n}} kaufen.',
}

export default de
