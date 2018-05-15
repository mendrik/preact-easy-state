import {observe, unobserve} from '@nx-js/observer-util'
import {ComponentClass} from 'inferno'

export function View(Comp: ComponentClass): any {

    class InfernoHoc extends Comp {

        constructor(props, context) {
            super(props, context)
            this.render = observe(this.render, {
                scheduler: () => this.setState({}),
                lazy: true
            })
        }

        shouldComponentUpdate(nextProps, nextState, nextContext) {
            const {props, state} = this

            // respect the case when user prohibits updates
            if (super.shouldComponentUpdate &&
                !super.shouldComponentUpdate(nextProps, nextState, nextContext)) {
                return false
            }

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
        }
    }

    return InfernoHoc
}
