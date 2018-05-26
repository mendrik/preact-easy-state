import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

export const GlobalEvent = (event: string, global: EventTarget = window) => (proto: QuillComponentClass, method: string) => {
    addToMountQueue(proto, (instance: QuillComponent) => {
        global.addEventListener(event, instance[method])
        addToCleanupQueue(instance, () => global.removeEventListener(event, instance[method]))
    })
}
