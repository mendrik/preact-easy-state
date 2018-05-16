import {Component} from 'inferno'
import model from '../model/application'
import {createElement} from 'inferno-create-element'
import {View} from '../util/view'
import {MediaQuery} from '../decorators/media-query'

export interface ApplicationState {
    counter: number
}

setInterval(() => model.counter++, 1000)

@View
export class Application extends Component<{}, ApplicationState> {

    @MediaQuery('(max-width: 320px)')
    mobile() {
        return <div>Mobile {model.counter}</div>
    }

    @MediaQuery('(min-width: 321px)')
    desktop() {
        return <div>Desktop {model.counter}</div>
    }
}
