export const hasPointers = 'onpointerdown' in document.documentElement
export const supportsOnlyTouch = /android|iphone|webos|ipad|ipod|blackberry/i.test(navigator.userAgent);

export const addEventListeners = (types: string[], node: Element, listener: EventListener, options?) => {
    types.forEach(type => node.addEventListener(type, listener, options))
}

export const removeEventListeners = (types: string[], node: Element, listener: EventListener) => {
    types.forEach(type => node.removeEventListener(type, listener))
}
