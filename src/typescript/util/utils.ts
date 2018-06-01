import {Overlap} from '../components/in-view/in-view'

export const scrollBarWidth = (): number => {
    const outside = document.createElement('div')
    const inside = document.createElement('div')
    outside.style.width = inside.style.width = '100%'
    outside.style.overflow = 'scroll'
    document.body.appendChild(outside).appendChild(inside)
    const scrollbar = outside.offsetWidth - inside.offsetWidth
    outside.parentNode.removeChild(outside)
    return scrollbar
}

export const domReady = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        document.addEventListener('DOMContentLoaded', () => {
            resolve()
        })
    })
}

export const box = (x: number, min: number, max: number) =>
    Math.min(Math.max(x, min), max)

export const range = (start: number, end: number) =>
    Array.from(Array(end - start + 1).keys()).map(n => n + start)

export const cls = (...parts): string => parts.reduce((p, c) => {
    if (c === null || typeof c === 'undefined') {
        return [...p]
    } else if (typeof c === 'string') {
        return [...p, c]
    } else if (Array.isArray(c)) {
        return [...p, ...c]
    } else if (Object.prototype.toString.call(c) === '[object Object]') {
        return [...p, ...Object.keys(c).filter(k => c[k])]
    }
}, []).join(' ')

class Rect {
    x: number
    y: number
    width: number
    height: number

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
}

export const includesX = (outer: ClientRect, inner: ClientRect): boolean => {
    return inner.left >= outer.left &&
           inner.right <= outer.right
}

export const includesY = (outer: ClientRect, inner: ClientRect): boolean => {
    return inner.top >= outer.top &&
           inner.bottom <= outer.bottom
}

export const intersectDiff = (outer: ClientRect, inner: ClientRect): Overlap => {
    return {
        diffX: includesX(outer, inner) || inner.width >= outer.width ? 0 :
               inner.left < outer.left ? outer.left - inner.left : inner.right - outer.right,
        diffY: includesY(outer, inner) || inner.height >= outer.height ? 0 :
               inner.top < outer.top ? outer.top - inner.top : inner.bottom - outer.bottom
    }
}

export const findParent = (start: HTMLElement, predicate: (start: HTMLElement) => boolean) => {
    let parent = start
    while (parent = parent.parentElement) {
        if (predicate(parent)) {
            return parent
        }
    }
}

export const withClass = <T extends {class: string}>(props: any, className: string): T => {
    props.class = props.class ? [...props.class.split(/\s+/), className].join(' ') : className
    return props
}

export const optional = <T>(property: string, value: T, condition: any) =>
    condition ? {[property]: value} : {}
