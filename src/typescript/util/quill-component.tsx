import {Component, h, RenderableProps} from 'preact'
import {observe, unobserve} from '@nx-js/observer-util'
import {runMountQueue, runUnmountQueue} from './construct'

export type QuillComponentClass<T = {}, S = {}> = {}

export abstract class QuillComponent<P = {}, S = {}> extends Component<P, S> {

    protected constructor(props, context?) {
        super(props, context)
        this.render = observe(this.render, {
            scheduler: () => this.setState({}),
            lazy: true
        })
    }

    componentDidMount() {
        runMountQueue(this as any, this.base)
        if (super.componentDidMount) {
            super.componentDidMount()
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {props, state} = this

        // return true if it is a reactive render or state changes
        if (state !== nextState) {
            return true
        }

        // the component should update if any of its props shallowly changed value
        const keys = Object.keys(props)
        const nextKeys = Object.keys(nextProps)
        return nextKeys.length !== keys.length || nextKeys.some(key => props[key] !== nextProps[key])
    }

    componentWillUnmount() {
        if (super.componentWillUnmount) {
            super.componentWillUnmount()
        }
        unobserve(this.render)
        runUnmountQueue(this as any)
    }

    render(props?: RenderableProps<P>, state?: Readonly<S>, context?: any): JSX.Element | null {
        return null
    }
}
