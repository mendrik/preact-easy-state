let docBase
const base = document.getElementsByTagName('base')
if (base) {
    docBase = base[0].href
}

import {addToCleanupQueue, addToMountQueue} from '../util/construct'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'
import {ensure, resolve} from '../util/ensure'
import {Component, h} from 'preact'
import Navigo from 'navigo'
import {View} from './view'
import {componentFromImport} from '../util/utils'
const router = new Navigo(docBase || window.location.href)
const currentRouteSymbol = Symbol('__route__')
const init = new WeakMap<any, boolean>()
const routes = new WeakMap<QuillComponentClass, IRoute[]>()

export interface IRoute {
    path: string,
    method: string
}

export const Route = (path: string) => (proto: QuillComponentClass, method: string) => {
    if (!init.has(proto)) {
        init.set(proto, true)
        Object.defineProperty(proto, 'render', {
            value: function () {
                return this[currentRouteSymbol] || null
            },
            writable: true,
            enumerable: true,
            configurable: true
        })
        addToMountQueue(proto, (instance: QuillComponent) => {
            instance.shouldComponentUpdate = () => false
            resolve(routes, instance).forEach(route => {
                const handler = async (params = {}, query) => {
                    const Component = await componentFromImport(instance[route.method]())
                    instance[currentRouteSymbol] = <Component {...params} query={query}/>
                    instance.forceUpdate()
                }
                router.on(route.path, handler)
                addToCleanupQueue(instance, () => router.off(route.path, handler))
            })
            router.resolve()
        })
    }
    ensure(routes, proto, [{path, method}])
}

export interface LinkProps {
    to: string
}

export const navigate = (path: string) => router.navigate(path)

@View
export class Link extends QuillComponent<LinkProps> {

    onClick = (ev) => {
        ev.preventDefault()
        router.navigate(this.props.to)
    }

    render({to, children, ...props}) {
        return <a href={to} {...props} onClick={this.onClick}>{children}</a>
    }
}
