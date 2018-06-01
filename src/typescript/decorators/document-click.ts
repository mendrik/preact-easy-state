import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'
import {observe, unobserve} from '@nx-js/observer-util'

export const DocumentClick = <T extends QuillComponent>
    (onWhen: (comp: T) => boolean) => (proto: QuillComponentClass, method: string) => {

    addToMountQueue(proto, (instance: T) => {
        observe(() => {
            if (onWhen(instance)) {
                const handler = (ev: MouseEvent) => {
                    if (!instance.base.contains(ev.target as Node)) {
                        instance[method](ev)
                        document.removeEventListener('mousedown', handler)
                    }
                }
                document.addEventListener('mousedown', handler)
            }
        })
        addToCleanupQueue(instance, () => unobserve(onWhen))
    })
}
