import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

export const CustomEvent = (event: string) => (proto: QuillComponentClass, method: string) => {
    addToMountQueue(proto, (instance: QuillComponent) => {
        const handler = (ev: CustomEvent<any>) => {
            instance[method](ev.detail)
        }
        instance.base.addEventListener(event, handler)
        addToCleanupQueue(instance, () => instance.base.removeEventListener(event, handler))
    })
}
