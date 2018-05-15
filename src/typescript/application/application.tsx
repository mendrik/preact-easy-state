import { Component, linkEvent } from 'inferno'
import model from '../model/application'
import {createElement} from 'inferno-create-element'
import {View} from '../util/view'

export interface ApplicationState {
    counter: number
}

@View
export class Application extends Component<{}, ApplicationState> {

    handleClick() {
        model.list.push('a')
    }

    render(props, state) {
        return (
            <div>
                <h1 onClick={linkEvent(props, this.handleClick)}>Header !</h1>
                <span><b>Counter</b> is at: {model.list.length}</span>
                <ul>
                    {model.list.map(i => <li>{i}</li>)}
                </ul>
            </div>
        )
    }
}
