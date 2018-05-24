import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

const mediaQuerySymbol = Symbol('__media_query__')

const init = new WeakMap<QuillComponentClass, boolean>()

export const MediaQuery = (query: string) => (proto: QuillComponentClass, method: string) => {
    if (!init.has(proto)) {
        init.set(proto, true)
        Object.defineProperty(proto, 'render', {
            value: function (props, state) {
                const currentRenderMethod = this[mediaQuerySymbol] || method
                if (currentRenderMethod) {
                    return this[currentRenderMethod].call(this, props, state)
                }
            },
            writable: true,
            enumerable: true,
            configurable: true
        })
    }

    const mediaQueryHandler = (instance: QuillComponent) => (mq: MediaQueryList) => {
        if (mq.matches) {
            instance[mediaQuerySymbol] = method
            instance.forceUpdate()
        }
    }

    addToMountQueue(proto, (instance: QuillComponent) => {
        const mediaQueryList = window.matchMedia(query)
        const handler = mediaQueryHandler(instance)
        mediaQueryList.addListener(handler)
        handler(mediaQueryList)
        addToCleanupQueue(instance, () => mediaQueryList.removeListener(handler))
    })
}
