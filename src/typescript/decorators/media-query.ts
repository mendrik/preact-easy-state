import {Component} from 'inferno'
import {createElement} from 'inferno-create-element'
import {addToCleanupQueue, addToMountQueue} from '../util/construct'

const mediaQuerySymbol = Symbol('__media_query__')

const init = new WeakMap<any, boolean>()

export const MediaQuery = (query: string) => (proto: any, method: string) => {
    if (!init.has(proto)) {
        init.set(proto, true)
        Object.defineProperty(proto, 'render', {
            value: function (props, state) {
                const currentRenderMethod = this[mediaQuerySymbol] || method
                if (currentRenderMethod) {
                    return this[currentRenderMethod](props, state)
                }
            },
            writable: true,
            enumerable: true,
            configurable: true
        })
    }

    const mediaQueryHandler = (instance: Component) => (mq: MediaQueryList) => {
        if (mq.matches) {
            instance[mediaQuerySymbol] = method
            instance.forceUpdate()
        }
    }

    addToMountQueue(proto, (instance: Component) => {
        const mediaQueryList = window.matchMedia(query)
        const handler = mediaQueryHandler(instance)
        mediaQueryList.addListener(handler)
        handler(mediaQueryList)
        addToCleanupQueue(instance, () => mediaQueryList.removeListener(handler))
    })
}
