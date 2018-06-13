import {extendVNode} from './nvode-extension'

let localeStore = {}

export type Map = {[s: string]: Map | string}
export type FlatMap = {[s: string]: string}

const flatten = (map: Map, keys = []): FlatMap => {
    return Object.keys(map).reduce((prev: {}, key: string) => {
        const currentValue = map[key]
        const currentKeys = [...keys, key]
        return typeof currentValue === 'string' ?
            prev[currentKeys.join('.')] = currentValue && prev :
            {...prev, ...flatten(currentValue as Map, currentKeys)}
    }, {})
}

export const initTranslations = (locales: Map) => {
    localeStore = flatten(locales)
    extendVNode(vnode => {
        const props = vnode.attributes
        if (props && props['data-locale']) {
            const key = props['data-locale']
            if (key) {
                vnode.children = [(localeStore[key] || key)]
            }
        }
    })
}

export const localized = (key: string): string|undefined =>
    key ? (localeStore[key] ? localeStore[key] : key) : undefined
