import {cloneElement, h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import './toast.pcss'
import {View} from '../../decorators/view'
import {CustomEvent} from '../../decorators/custom-event'

let id = 0

@View
export class Toasts extends QuillComponent {

    toasts: Map<string, JSX.Element> = new Map()

    @CustomEvent('close-toast')
    done = (ev) => {
        const id = ev.id || ev.target.id
        this.toasts.delete(id)
        this.base.removeChild(this.base.querySelector(`#${id}`))
        this.forceUpdate()
    }

    showToast = (toast: JSX.Element) => {
        const toastId = `toast-${id++}`
        toast.attributes.id = toastId
        this.toasts.set(toastId, toast)
        this.forceUpdate()
    }

    render() {
        return (
            <ul class="toast-manager" onAnimationEnd={this.done}>
                {Array.from(this.toasts.values())}
            </ul>
        )
    }
}
