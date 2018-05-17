import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

export const WindowEvent = (event: string) => (proto: QuillComponentClass, method: string) => {
    addToMountQueue(proto, (instance: QuillComponent) => {
        window.addEventListener(event, instance[method])
        addToCleanupQueue(instance, () => window.removeEventListener(event, instance[method]))
    })
}
