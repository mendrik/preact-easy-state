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
