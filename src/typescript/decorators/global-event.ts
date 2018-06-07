import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

export const GlobalEvent = (event: string, global: EventTarget = window, condition?: () => boolean) =>
    (proto: QuillComponentClass, method: string) => {
        if (typeof condition === 'undefined' || condition() === true) {
            addToMountQueue(proto, (instance: QuillComponent) => {
                global.addEventListener(event, instance[method])
                addToCleanupQueue(instance, () => global.removeEventListener(event, instance[method]))
            })
        }
}
