import {Component} from 'inferno/core/component'
import {ensure} from '../util/ensure'
import {observable, observe} from '@nx-js/observer-util'

const localStorageQueue = new WeakMap<Component, Array<PropertyHandler>>()

export function LocalStorage(Base: { new(...args: any[])}): any {
    return class LocalStorage extends Base {
        constructor(...args) {
            super(...args)
            const key = Object.getPrototypeOf(Object.getPrototypeOf(this))
            const observed = observable(this)
            if (localStorageQueue.has(key)) {
                localStorageQueue.get(key).forEach(handler => {
                    try {
                        observed[handler.property] = handler.reader(localStorage.getItem(handler.key))
                    } catch (e) {
                        // ignore
                    }
                    observe(() => {
                        localStorage.setItem(handler.key, handler.writer(observed[handler.property]))
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
    key: string,
    property: string
}

export const Store = (key: string, reader: Reader = defaultReader, writer: Writer = defaultWriter) => (proto: any, property: string) => {
    ensure(localStorageQueue, proto, [{key, reader, writer, property}])
}

