import {options, VNode} from 'preact'

type VNodeExtension = (node: VNode) => void

const queue: Array<VNodeExtension> = []

const old = options.vnode
options.vnode = (vnode: VNode) => {
    queue.forEach(extend => extend(vnode))
    if (old) {
        old(vnode)
    }
}

export const extendVNode = (task: VNodeExtension) => queue.push(task)
