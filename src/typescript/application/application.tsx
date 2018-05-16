import {Component} from 'inferno'
import model from '../model/application'
import {createElement} from 'inferno-create-element'
import {View} from '../util/view'
import {MediaQuery} from '../decorators/media-query'
import {FetchFailure, Post} from '../decorators/fetch'

export interface ApplicationState {
    counter: number
}

// setInterval(() => model.counter++, 1000)

@View
export class Application extends Component<{}, ApplicationState> {

    @Post('/data.json')
    loadData: (body: any) => Promise<any>

    async componentDidMount() {
        const data = await this.loadData({request: 1234})
        console.log(data)
    }

    @FetchFailure(404)
    notFound() {
        console.log('Faaaiiiil')
    }

    @MediaQuery('(max-width: 320px)')
    mobile() {
        return <div>Mobile {model.counter}</div>
    }

    @MediaQuery('(min-width: 321px)')
    desktop() {
        return <div>Desktop {model.counter}</div>
    }
}
