import express, { Application, Request, Response } from 'express'
import locale from 'locale'

import L from './i18n/i18n-node'
import { baseLocale, locales } from './i18n/i18n-util'
import { Locales } from './i18n/i18n-types'

const app: Application = express()

const port = 3001

type Params = {
	locale: Locales
	name: string
}

app.get('/favicon.ico', (req, res) => res.status(204))

app.get('/:locale/:name', (req: Request<Params>, res: Response) => {
	const { locale, name } = req.params

	res.send(L[locale].HI({ name }))
})

app.get('/:locale', (req: Request<Params>, res: Response) => {
	const { locale } = req.params

	const response = `
${L[locale].HI({ name: 'world' })}
<br>
${L[locale].INSTRUCTIONS_NAME()}
`

	res.send(response)
})

app.get('*', (req: Request, res: Response) => {
	const locale = getPreferredLocale(req)
	res.send(L[locale].INSTRUCTIONS_LOCALE())
})

const getPreferredLocale = (req: Request): Locales => {
	const supportedLocales = new locale.Locales(locales, baseLocale)
	const parsedLocales = new locale.Locales(req.headers['accept-language'])
	const bestLocale = parsedLocales.best(supportedLocales)

	return (bestLocale?.code.toLowerCase() as Locales) || baseLocale
}

app.listen(port, () => console.log(`App is listening on port ${port}`))
