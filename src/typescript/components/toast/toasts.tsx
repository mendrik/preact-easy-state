import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import './toast.pcss'

@View
export class Toasts extends QuillComponent {

    toasts: JSX.Element[] = []

    constructor(props) {
        super(props)
    }

    showToast = (toast: JSX.Element) => {
        this.toasts.push(toast)
        this.forceUpdate()
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <ul class="toast-manager">
                {this.toasts}
            </ul>
        )
    }
}
