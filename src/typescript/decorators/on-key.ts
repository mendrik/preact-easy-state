import {QuillComponent, QuillComponentClass} from '../util/quill-component'
import {debounce} from 'throttle-debounce'
import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {ensure} from '../util/ensure'

const keyHandlers = new WeakMap<QuillComponent, {[s: string]: Function}>()

export const Key = (key: string) => (proto: QuillComponentClass, protoMethod: string) => {
    addToMountQueue(proto, component => {
        ensure(keyHandlers, component, {[key]: component[protoMethod].bind(component)})
        addToCleanupQueue(component, () => keyHandlers.delete(component))
    })
}

export const onKey = (component: QuillComponent<any, any>, target?: EventTarget) => (ev: KeyboardEvent) => {
    const handler = keyHandlers.get(component)
    if (handler && handler[ev.key] && (!target || target === ev.target)) {
        ev.preventDefault()
        handler[ev.key](ev.key)
    }
}

export const onKeySpy = (component: QuillComponent<any, any>, target?: EventTarget) => (ev: KeyboardEvent) => {
    const handler = keyHandlers.get(component)
    if (handler && handler[ev.key] && (!target || target === ev.target)) {
        handler[ev.key](ev)
    }
}
