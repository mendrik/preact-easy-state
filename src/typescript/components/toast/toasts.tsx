import {h} from 'preact'
import {observable} from '@nx-js/observer-util'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import './toast.pcss'
import {Toast, ToastComp} from './toast'

export class Model {
    toasts?: Toast[] = []
}

@View
export class Toasts extends QuillComponent<Model> {

    model: Model

    constructor(props) {
        super(props)
        this.model = observable(new Model())
    }

    showToast = (toast: Toast) => {
        this.model.toasts.push(toast)
    }

    animationEnd = (toast: Toast) => () => {
        const toasts = this.model.toasts
        toasts.splice(toasts.indexOf(toast), 1)
    }

    render() {
        return (
            <ul class="toast-manager">
                {this.model.toasts.map(props =>
                    <ToastComp {...props} onAnimationEnd={this.animationEnd(props)}/>)}
            </ul>
        )
    }
}
