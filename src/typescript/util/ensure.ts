import {QuillComponent, QuillComponentClass} from './quill-component'

export const isObject = (obj: any): boolean =>
    (obj !== null && typeof(obj) === 'object' && Object.prototype.toString.call(obj) === '[object Object]')

export const merge = (a: any = {}, b: any): any => {
    for (const k of Object.keys(b)) {
        const ak = a[k],
              bk = b[k]
        if (Array.isArray(ak)) {
            ak.push(...bk)
        }
        else if (isObject(ak)) {
            merge(ak, bk)
        }
        else {
            a[k] = bk
        }
    }
    return a
}

export const ensure = <T>(map: WeakMap<{}, T> | Map<{}, T>,
                          obj: any,
                          defaultValue: any): T => {
    let lookup: any = map.get(obj)
    if (!lookup) {
        map.set(obj, lookup = defaultValue)
    }
    else if (Array.isArray(lookup) && Array.isArray(defaultValue)) {
        lookup.push(...defaultValue)
    }
    else if (isObject(lookup)) {
        merge(lookup, defaultValue)
    }
    return lookup
}

export const resolve = <T>(map: WeakMap<QuillComponentClass, T>, obj: any): T => {
    let c = obj
    while (c = Object.getPrototypeOf(c)) {
        if (map.has(c)) {
            return map.get(c)
        }
    }
}
