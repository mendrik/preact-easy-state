import {Component, h, RenderableProps} from 'preact'

export type QuillComponentClass<T = {}, S = {}> = {}

export abstract class QuillComponent<P = {}, S = {}> extends Component<P, S> {
    render(props?: RenderableProps<P>, state?: Readonly<S>, context?: any): JSX.Element | null {
        return null
    }
}
