import {options} from 'preact'

export const initTranslations = (locales: {[s: string]: string}) => {
    const old = options.vnode
    options.vnode = vnode => {
        const props = vnode.attributes
        if (props) {
            const key = props['data-locale']
            if (key) {
                vnode.children = [locales[key]]
            }
        }
        if (old) {
            old(vnode)
        }
    }
}
