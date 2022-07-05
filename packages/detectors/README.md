# `typesafe-i18n` Detectors

Locale detection is a key part of any i18n solution. Therefore `typesafe-i18n` provides a solution to detect a user's locale.

## Setup

See [here](https://github.com/ivanhofer/typesafe-i18n#get-started) on more information how to set up `typesafe-i18n`.

### manual installation

```bash
npm install typesafe-i18n
```

## Detectors

To automatically detect a users locale, you can use the `detectLocale` function:

```typescript
import { detectLocale } from 'typesafe-i18n/detectors'

const detectedLocale = detectLocale(fallbackLocale, availableLocales, detector)
```

The function expects following parameters:
 - `fallbackLocale: string`\
   When no matching locale is found this value is used.
 - `availableLocales: string[]`\
   A list of locales your application supports.
 - `detector: () => string[]`
   A function that returns a list of locales. You can also pass multiple detectors. If the first detector does not find any matching locale, the next detector will be called and so on.
   ```typescript
   detectLocale(fallbackLocale, availableLocales, detector1, detector2, /* ... */ detector7)
   ```

### Detectors

Detectors can be used either on the [browser](#browser) or the [server](#server) side. You can use the [built-in detectors](#server) or write your own `detector` functions:

```typescript
import { detectLocale } from 'typesafe-i18n/detectors'

const fallbackLocale = 'de'
const availableLocales = ['de', 'en' 'it', 'fr']

const customDetector = () => {
   const locale = detectRandomLocale() // your custom locale detector

   return [locale]
}

const detectedLocale = detectLocale(fallbackLocale, availableLocales, customDetector)
```

> if you need to access any request-specific variable, you would need to "initialize" the function first, since the detector is called without any arguments. The "initialization" function is needed to bind some values that can be used when executing the function later. The return type of that function is the detector, you need to pass to the `detectLocale` function.
>
> ```typescript
> const initIpDetector = (req: Request) => {
>    return () => {
>       const locale = detectLocaleFromIpAddress(req) // your custom locale detector
>
>       return [locale]
>    }
> }
>
> app.use((req: Request, res: Response) => {
>    const ipDetector = initIpDetector(req)
>    const detectedLocale = detectLocale(fallbackLocale, availableLocales, ipDetector)
>
>    res.json({
>       locale: detectedLocale,
>    })
> })
> ```


`typesafe-i18n` offers a few built-in detectors you can use:

### Server

This detectors are expected to run on a server-environment e.g. an express server or serverless function. These detectors **all expect** an [`express`](http://expressjs.com/)-compatible [`req`](http://expressjs.com/en/api.html#req) object.

#### `accept-language` header

Reads and parses the `'accept-language'` header.\
e.g. `'accept-language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5'`\
The function needs to be initialized first and expects you to pass the `Request` object.

```typescript
import { detectLocale, initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors'

app.use((req: Request, res: Response) => {
   const acceptLanguageHeaderDetector = initAcceptLanguageHeaderDetector(req)
   // or: const acceptLanguageHeaderDetector = initAcceptLanguageHeaderDetector(req, 'Accept-Language')
   const detectedLocale = detectLocale(fallbackLocale, availableLocales, acceptLanguageHeaderDetector)

   res.json({
      locale: detectedLocale,
   })
})
```

The default header is `'accept-language'`, but you can change it by passing a `string` as a second argument to the `initAcceptLanguageHeaderDetector` function.


#### cookies

Reads and parses the `Request-cookies`.\
The function needs to be initialized first and expects you to pass the `Request` object.

```typescript
import { detectLocale, initRequestCookiesDetector } from 'typesafe-i18n/detectors'

app.use((req: Request, res: Response) => {
   const requestCookiesDetector = initRequestCookiesDetector(req)
   // or: const requestCookies = initRequestCookiesDetector(req, 'user-lang')
   const detectedLocale = detectLocale(fallbackLocale, availableLocales, requestCookies)

   res.json({
      locale: detectedLocale,
   })
})
```

The default cookie name is `'lang'`, but you can change it by passing a `string` as a second argument to the `initRequestCookiesDetector` function.

#### hostname

Detects the locale from the request's hostname.\
e.g. fr.example.com or fr-CA.example.com\
The function needs to be initialized first and expects you to pass the `Request` object.

```typescript
import { detectLocale, initRequestHostnameDetector } from 'typesafe-i18n/detectors'

app.use((req: Request, res: Response) => {
   const requestHostnameDetector = initRequestHostnameDetector(req)
   // or: const requestHostnameDetector = requestHostnameDetector(req, 'host-name')
   const detectedLocale = detectLocale(fallbackLocale, availableLocales, requestHostnameDetector)

   res.json({
      locale: detectedLocale,
   })
})
```

#### parameters

Extracts the locale from the request's path.\
e.g. `/:lang/products`\
The function needs to be initialized first and expects you to pass the `Request` object.

```typescript
import { detectLocale, initRequestParametersDetector } from 'typesafe-i18n/detectors'

app.get('/:lang/products', (req: Request, res: Response) => {
   const requestParametersDetector = initRequestParametersDetector(req)
   // or: const requestParametersDetector = initRequestParametersDetector(req, 'user-lang')
   const detectedLocale = detectLocale(fallbackLocale, availableLocales, requestParametersDetector)

   res.json({
      locale: detectedLocale,
   })
})
```

The default parameter name is `'lang'`, but you can change it by passing a `string` as a second argument to the `initRequestParametersDetector` function.


### Browser

This detectors are expected to run in a browser-environment e.g. on the website an user visits.

#### navigator

Detects the browser locales by accessing [navigator.languages](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages).

```typescript
import { detectLocale, navigatorDetector } from 'typesafe-i18n/detectors'

const detectedLocale = detectLocale(fallbackLocale, availableLocales, navigatorDetector)
```


#### html `lang` attribute

Detects the locale on a website by reading the HTML `lang` attribute.

```html
<html lang="en">
   <!-- your website's content-->
</html>
```

##### usage:

```typescript
import { detectLocale, htmlLangAttributeDetector } from 'typesafe-i18n/detectors'

const detectedLocale = detectLocale(fallbackLocale, availableLocales, htmlLangAttributeDetector)
```


#### query-string

Detects the locale from a websites URL.\
e.g. `https://www.example.com/product-1/details.html?lang=de`


##### usage:

```typescript
import { detectLocale, queryStringDetector } from 'typesafe-i18n/detectors'

const detectedLocale = detectLocale(fallbackLocale, availableLocales, queryStringDetector)
```

The default parameter is `'lang'`, but you can change it by using the `initQueryStringDetector` function:

```typescript
import { detectLocale, initQueryStringDetector } from 'typesafe-i18n/detectors'

const queryStringDetector = initQueryStringDetector('user-lang')
const detectedLocale = detectLocale(fallbackLocale, availableLocales, queryStringDetector)
```


#### localStorage

Looks for an entry inside the [`localStorage`](https://developer.mozilla.org/de/docs/Web/API/Window/localStorage).

##### usage:

```typescript
import { detectLocale, localStorageDetector } from 'typesafe-i18n/detectors'

const detectedLocale = detectLocale(fallbackLocale, availableLocales, localStorageDetector)
```

The default item-key is `'lang'`, but you can change it by using the `initLocalStorageDetector` function:

```typescript
import { detectLocale, initLocalStorageDetector } from 'typesafe-i18n/detectors'

const localStorageDetector = initLocalStorageDetector('user-lang')
const detectedLocale = detectLocale(fallbackLocale, availableLocales, localStorageDetector)
```


#### sessionStorage

Looks for an entry inside the [`sessionStorage`](https://developer.mozilla.org/de/docs/Web/API/Window/sessionStorage).

##### usage:

```typescript
import { detectLocale, sessionStorageDetector } from 'typesafe-i18n/detectors'

const detectedLocale = detectLocale(fallbackLocale, availableLocales, sessionStorageDetector)
```

The default item-key is `'lang'`, but you can change it by using the `initSessionStorageDetector` function:


```typescript
import { detectLocale, initSessionStorageDetector } from 'typesafe-i18n/detectors'

const sessionStorageDetector = initSessionStorageDetector('user-lang')
const detectedLocale = detectLocale(fallbackLocale, availableLocales, sessionStorageDetector)
```


#### cookies

Detects the locale by parsing the website's cookies.

> Note: this detector can only read cookies that are not marked as [secure](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies). If your locale-cookie is set with a secure-context, the detector will not work.

##### usage:

```typescript
import { detectLocale, documentCookieDetector } from 'typesafe-i18n/detectors'

const detectedLocale = detectLocale(fallbackLocale, availableLocales, documentCookieDetector)
```

The default cookie name is `'lang'`, but you can change it by using the `initSessionStorageDetector` function:

```typescript
import { detectLocale, initDocumentCookieDetector } from 'typesafe-i18n/detectors'

const documentCookieDetector = initDocumentCookieDetector('user-lang')
const detectedLocale = detectLocale(fallbackLocale, availableLocales, documentCookieDetector)
```
