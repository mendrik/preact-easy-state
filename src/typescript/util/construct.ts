import {ensure} from './ensure'
import {Component} from 'preact'

export type QueueCall = (c: Component, el: HTMLElement) => void
export type CleanupCall = () => void

const mountQueue = new WeakMap<any, Array<QueueCall>>()
const unmountQueue = new WeakMap<Component, Array<CleanupCall>>()

export const runMountQueue = (comp: Component, el: HTMLElement) => {
    let c = comp
    while (c = Object.getPrototypeOf(c)) {
        if (mountQueue.has(c.constructor)) {
            return mountQueue.get(c.constructor).forEach(func => func(comp, el))
        }
    }
}

export const runUnmountQueue = (c: Component) => {
    unmountQueue.has(c) &&
    unmountQueue.get(c).forEach(func => func())
}

export const addToMountQueue = (proto: any, call: QueueCall) =>
    ensure(mountQueue, proto.constructor, [call])

export const addToCleanupQueue = (comp: Component, call: CleanupCall) =>
    ensure(mountQueue, comp, [call])

