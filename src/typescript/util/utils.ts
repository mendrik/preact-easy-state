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
    if (typeof c === 'string') {
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

export const intersect = (a: ClientRect, b: ClientRect): Rect|never => {
    const x = Math.max(a.left, b.left)
    const num1 = Math.min(a.left + a.width, b.left + b.width)
    const y = Math.max(a.top, b.top)
    const num2 = Math.min(a.top + a.height, b.top + b.height)
    if (num1 >= x && num2 >= y) {
        return new Rect(x, y, num1 - x, num2 - y)
    }
}
