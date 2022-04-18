import { queryStringDetector } from 'typesafe-i18n/detectors'
import type { Locales, TranslationFunctions } from './i18n/i18n-types'
import { detectLocale, i18nObject, locales } from './i18n/i18n-util'
import { loadAllLocales } from './i18n/i18n-util.sync'

const localeSwitcher = document.querySelector<HTMLDivElement>('#locale-switcher')!
const content = document.querySelector<HTMLDivElement>('#content')!

let LL: TranslationFunctions

// ----------------------------------------------------------------------------

const renderLocaleSwitcher = (locale: Locales) => {
  localeSwitcher.innerHTML = `
<p>
  ${LL.locale.choose()}
  <select>
    ${locales.map(loc => `
    <option value="${loc}" ${locale === loc ? 'selected' : ''}>${loc}</option>`).join('')}
  </select>
</p>
<h3>${LL.locale.selected()} ${locale}</h3>
`

  const select = localeSwitcher.querySelector('select')!
  select.addEventListener('change', () => {
    const selectedLocale = select.value as Locales

    history.pushState(undefined, '', `?lang=${selectedLocale}`)
    console.log('locale changed to:', selectedLocale)
    render()
  })
}

// ----------------------------------------------------------------------------

const renderContent = () => {
  const now = new Date()
  const later = new Date(now.getTime() + 3 * 60 * 60 * 1000) // in 3 hours

  content.innerHTML = `
<hr>${LL.custom(100)}
<hr>${LL.chaining(5)}
<hr>${LL.builtin.date(now)}
<hr>${LL.builtin.time(later)}
<hr>${LL.builtin.number(12345)}
<hr>${LL.builtin.replace('super cool product')}
<hr>${LL.builtin['identity-and-ignore']({ name: 'John' })}
<hr>${LL.builtin.uppercase('Hello')}
<hr>${LL.builtin.lowercase('SOMETHING')}
`}

// ----------------------------------------------------------------------------

// our render function that generates HTML code
const render = () => {
  // auto-detect locale by reading the "lang" query params from the URL
  const locale = detectLocale(queryStringDetector)

  LL = i18nObject(locale)

  renderLocaleSwitcher(locale)
  renderContent()
}

// re-renders everything if you navigate back and forth via the browser controls
window.addEventListener('popstate', render)

// load all locales into memory
loadAllLocales()

render()
