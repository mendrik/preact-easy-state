import {Component, h} from 'preact'
import './progress-bar.pcss'

export class ProgressBar extends Component {

    componentDidMount() {
        document.documentElement.classList.add('progress')
    }

    componentWillUnmount() {
        document.documentElement.classList.remove('progress')
    }

    render() {
        return <div class="progress-runner animated fadeIn"/>
    }
}
