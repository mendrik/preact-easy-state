import { Component, linkEvent } from 'inferno'
import model from '../model/application'
import {createElement} from 'inferno-create-element'
import {View} from '../util/view'

export interface ApplicationState {
    counter: number
}

@View
export class Custom extends Component<{}, ApplicationState> {

    render(props, state) {
        return <span>Custom</span>
    }
}
