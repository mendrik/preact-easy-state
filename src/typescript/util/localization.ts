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
        sessionStorage.setItem(key, flatMap[key])
    )
}

export const localized = (key: string): string|undefined => {
    return key ? (sessionStorage.getItem(key) ? sessionStorage.getItem(key) : key) : null
}

