import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'
import {observe, unobserve} from '@nx-js/observer-util'
import {hasPointers} from '../util/events'

export const DocumentClick = <T extends QuillComponent>
    (onWhen: (comp: T) => boolean) => (proto: QuillComponentClass, method: string) => {
    const event = hasPointers ? 'pointerdown' : 'touchstart'
    addToMountQueue(proto, (instance: T) => {
        observe(() => {
            if (onWhen(instance)) {
                const handler = (ev: MouseEvent) => {
                    if (!instance.base.contains(ev.target as Node)) {
                        instance[method](ev)
                        document.removeEventListener(event, handler)
                    }
                }
                document.addEventListener(event, handler)
            }
        })
        addToCleanupQueue(instance, () => unobserve(onWhen))
    })
}
