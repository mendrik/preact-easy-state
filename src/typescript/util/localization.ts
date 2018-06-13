import {locales} from '../model/locales'

export type SimpleMap = {[s: string]: SimpleMap | string}
export type FlatMap = {[s: string]: string}

const flatten = (map: SimpleMap, keys = []): FlatMap => {
    return Object.keys(map).reduce((prev: {}, key: string) => {
        const currentValue = map[key]
        const currentKeys = [...keys, key]
        if (typeof currentValue === 'string') {
            prev[currentKeys.join('.')] = currentValue
        } else {
            prev = {...prev, ...flatten(currentValue, currentKeys)}
        }
        return prev
    }, {})
}

export const initTranslations = (localeMap: SimpleMap) => {
    const flatMap = flatten(localeMap)
    Object.keys(flatMap).forEach(key =>
        locales.set(key, flatMap[key])
    )
}

export const localized = (key: string): string|undefined => {
    return key ? (locales.has(key) ? locales.get(key) : key) : null
}

