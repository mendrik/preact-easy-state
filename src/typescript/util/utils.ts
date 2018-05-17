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
