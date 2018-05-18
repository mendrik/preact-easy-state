import {ensure, resolve} from '../util/ensure'
import {observable, observe} from '@nx-js/observer-util'
import {QuillComponentClass} from '../util/quill-component'

const localStorageQueue = new WeakMap<QuillComponentClass, Array<PropertyHandler>>()

export function LocalStorage(Base: { new(...args: any[])}): any {
    return class LocalStorage extends Base {
        constructor(...args) {
            super(...args)
            const handlers = resolve(localStorageQueue, this)
            if (handlers) {
                const observed = observable(this)
                handlers.forEach(handler => {
                    const key = typeof handler.key === 'string' ?
                        handler.key :
                        handler.key(observed)
                    try {
                        observed[handler.property] = handler.reader(localStorage.getItem(key))
                    } catch (e) {
                        // ignore
                    }
                    observe(() => {
                        localStorage.setItem(key, handler.writer(observed[handler.property]))
                    })
                })
            }
        }
    }
}

const defaultReader = <T>(input: string): T => JSON.parse(input).value
const defaultWriter = <T>(input: T): string => JSON.stringify({value: input})

export type Reader = <T>(input: string) => T
export type Writer = <T>(input: T) => string

interface PropertyHandler {
    reader: Reader,
    writer: Writer,
    key: StringFactory,
    property: string
}

export type StringFactory = ((v: any) => string) | string

export const Store = (key: StringFactory, reader: Reader = defaultReader, writer: Writer = defaultWriter) => (proto: QuillComponentClass, property: string) => {
    ensure(localStorageQueue, proto, [{key, reader, writer, property}])
}

