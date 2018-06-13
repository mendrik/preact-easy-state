const LOCALE_STORAGE = 'locales'
const locales = window[LOCALE_STORAGE] || (window[LOCALE_STORAGE] = new Map())
export {locales}
