import {extendVNode} from './nvode-extension'

let localeStore = {}

export const initTranslations = (locales: {[s: string]: string}) => {
    localeStore = locales
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
