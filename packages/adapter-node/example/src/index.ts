import type { Application, Request, Response } from 'express'
import express from 'express'
import { initAcceptLanguageHeaderDetector, initRequestParametersDetector } from 'typesafe-i18n/detectors'
import L from './i18n/i18n-node'
import type { Locales } from './i18n/i18n-types'
import { detectLocale } from './i18n/i18n-util'
import { loadAllLocales } from './i18n/i18n-util.sync'

const app: Application = express()

const port = 3001

type Params = {
	locale: Locales
	name: string
}

app.get('/favicon.ico', (_req, res) => res.status(204))

app.get('/:locale/:name', (req: Request<Params>, res: Response) => {
	const { name } = req.params
	const locale = getPreferredLocale(req)

	res.send(L[locale].HI({ name }))
})

app.get('/:locale', (req: Request<Params>, res: Response) => {
	const locale = getPreferredLocale(req)

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
	const requestParametersDetector = initRequestParametersDetector(req, 'locale')
	const headers = { get: (key: string) => req.headers[key] as string || null }
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector({ headers })

	return detectLocale(requestParametersDetector, acceptLanguageDetector)
}

loadAllLocales()

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App is listening on port ${port}`))
