import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'
import {addEventListeners, hasPointers, removeEventListeners, supportsOnlyTouch} from '../util/events'

type EventType = 'start' | 'move' | 'end'
type EventSet = {[k in EventType]: string[]}
type PointerEvent = MouseEvent & TouchEvent

const PointerEvents: EventSet = {
    start: ['pointerdown'],
    move: ['pointermove'],
    end: ['pointerup']
}

const OnlyTouch: EventSet = {
    start: ['touchstart'],
    move: ['touchmove'],
    end: ['touchend']
}

const NoPointerEvents: EventSet = {
    start: ['touchstart', 'mousedown'],
    move: ['touchmove', 'mousemove'],
    end: ['touchend', 'mouseup']
}

const eventSet = hasPointers ? PointerEvents : (supportsOnlyTouch ? OnlyTouch : NoPointerEvents)

export enum Phase {
    start,
    move,
    end
}

interface ExtraInfo {
    startX: number
    startY: number
    startTime: number
}

export interface PanXEventInit {
    x: number,
    y: number,
    phase: Phase,
    diffX: number,
    diffY: number,
    diffTime: number,
    target: EventTarget
}

const getPanXEvent = (ev: PointerEvent, phase: Phase, extra = {} as ExtraInfo) => {
    const x = ev.clientX || (ev.touches && ev.touches.length ?
        ev.touches[0].pageX : ev.changedTouches[0].pageX)
    const y = ev.clientY || (ev.touches && ev.touches.length ?
        ev.touches[0].pageY : ev.changedTouches[0].pageY)
    return new CustomEvent<PanXEventInit>('pan-x', {
        bubbles: true,
        cancelable: true,
        detail: {
            x,
            y,
            phase,
            diffX: x - extra.startX,
            diffY: y - extra.startY,
            diffTime: +new Date() - extra.startTime,
            target: ev.target
        }
    })
}

const doc = document.documentElement

const distance = (s: CustomEvent<PanXEventInit>) =>
    Math.sqrt(s.detail.diffX * s.detail.diffX + s.detail.diffY * s.detail.diffY)

const initPanX = (component: QuillComponent, method: string, node: HTMLElement) => {
    const handler = (sev: PointerEvent) => {
        const time = +new Date(),
              isMouse = /mouse/.test(sev.type)
        if (sev.which === 3) {
            return
        }
        const setIndex = isMouse ? 1 : 0
        // - - - start - - - //
        sev.preventDefault()
        const startEvent = getPanXEvent(sev, Phase.start)
        const extra = {
            startTime: time,
            startX: startEvent.detail.x,
            startY: startEvent.detail.y
        }
        // - - - move - - - //
        component[method](startEvent)
        const moveListener = (mev: PointerEvent) => {
            const moveEvent = getPanXEvent(mev, Phase.move, extra)
            if (distance(moveEvent) > 5) {
                mev.preventDefault()
                component[method](moveEvent)
            }
        }
        doc.addEventListener(eventSet.move[setIndex], moveListener)
        // - - - end - - - //
        const endListener = (eev: PointerEvent) => {
            const endEvent = getPanXEvent(eev, Phase.end, extra)
            component[method](endEvent)
            if (distance(endEvent) < 5) {
                eev.target.dispatchEvent(new CustomEvent('tap', {bubbles: true, cancelable: true}))
            }
            doc.removeEventListener(eventSet.move[setIndex], moveListener)
            doc.removeEventListener(eventSet.end[setIndex], endListener)
        }
        doc.addEventListener(eventSet.end[setIndex], endListener)
    }
    addEventListeners(eventSet.start, node, handler)
    addToCleanupQueue(component, () => removeEventListeners(eventSet.start, node, handler))
}

export const PanX = (selector?: string) => (proto: QuillComponentClass, method: string) => {
    addToMountQueue(proto, (instance: QuillComponent, node: HTMLElement) => {
        initPanX(instance, method, selector ? node.querySelector(selector) : node)
    })
}
