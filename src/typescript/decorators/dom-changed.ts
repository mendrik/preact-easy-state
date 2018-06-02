import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

export const DomChanged = (getElement?: (el: Element) => Element, condition?: () => boolean) => (proto: QuillComponentClass, method: string) => {
    if (!condition || condition()) {
        addToMountQueue(proto, (instance: QuillComponent, node: HTMLElement) => {
            const el = getElement ? getElement(node) : node
            const observer = new MutationObserver(() => instance[method](instance))
            observer.observe(el, {childList: true, subtree: true, attributes: true})
            addToCleanupQueue(instance, () => observer.disconnect())
        })
    }
}
