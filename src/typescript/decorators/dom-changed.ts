import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'
import {debounce} from 'throttle-debounce'

export const NO_DOM_CHANGE = 'no-dom-change'

export const DomChanged = (getElement?: (el: Element) => Element, condition?: () => boolean) => (proto: QuillComponentClass, method: string) => {
    if (typeof condition === 'undefined' || condition() === true) {
        addToMountQueue(proto, (instance: QuillComponent, node: HTMLElement) => {
            const el = getElement ? getElement(node) : node
            const callback = (mr: MutationRecord[]) => {
                if (mr.length === 1 && mr[0].target['classList'] && mr[0].target['classList'].contains(NO_DOM_CHANGE)) {
                    return
                }
                instance[method](instance)
            }
            const observer = new MutationObserver(debounce(200, false, callback) as MutationCallback)
            observer.observe(el, {childList: true, subtree: true, attributes: true})
            addToCleanupQueue(instance, () => observer.disconnect())
        })
    }
}
