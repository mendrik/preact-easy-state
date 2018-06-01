import {QuillComponentClass} from '../util/quill-component'
import {debounce} from 'throttle-debounce'
import {addToCleanupQueue, addToMountQueue} from '../util/construct'

export const Debounce = (ms: number) => (proto: QuillComponentClass, protoMethod: string) => {
    addToMountQueue(proto, component => {
        const old = component[protoMethod]
        component[protoMethod] = debounce(ms, old).bind(component)
        addToCleanupQueue(component, () => component[protoMethod] = old)
    })
}
