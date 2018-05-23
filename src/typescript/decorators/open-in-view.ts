import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'
import {observe, unobserve} from '@nx-js/observer-util'

export interface Overlap {
    diffX: number
    diffY: number
}

export const OpenInView = <T extends QuillComponent>
    (onWhen: (comp: T) => boolean) => (proto: QuillComponentClass, method: string) => {

    addToMountQueue(proto, (instance: T) => {
        observe(() => onWhen(instance), {
            scheduler: () => {
                if (onWhen(instance)) {
                    console.log('yes')
                }
            }
        })
        addToCleanupQueue(instance, () => unobserve(onWhen))
    })
}
