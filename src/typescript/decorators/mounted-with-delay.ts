import {addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

export type Milliseconds = number

export const MountedWithDelay = (delay: Milliseconds) => (proto: QuillComponentClass, method: string) => {
    addToMountQueue(proto, (instance: QuillComponent, node: HTMLElement) => {
        setTimeout(() => instance[method](node), delay)
    })
}
