import {extendVNode} from './nvode-extension'

export const initTranslations = (locales: {[s: string]: string}) => {
    extendVNode(vnode => {
        const props = vnode.attributes
        if (props && props['data-locale']) {
            const key = props['data-locale']
            if (key) {
                vnode.children = [locales[key]]
            }
        }
    })
}
