import {h, render} from 'preact'
import {observable} from '@nx-js/observer-util'
import {View} from '../../decorators/view'
import {cls} from '../../util/utils'
import {QuillComponent} from '../../util/quill-component'
import {localized} from '../../util/localization'
import './toast.pcss'
import {createContext} from 'preact-context'

export enum ToastTheme {
    INFO,
    WARNING,
    DANGER
}

export interface ToastProps {
    title: string
    message: string
    theme?: ToastTheme
    done?: () => void
}

enum State {
    initial = 'initial',
    showing = 'showing'
}

interface ToastState {
    visible: State
}

@View
class Toast extends QuillComponent<ToastProps, ToastState> {

    static defaultProps = {
        theme: ToastTheme.INFO
    }

    animationEnd = () => {
        if (this.state.visible === State.initial) {
            this.setState({visible: State.showing})
        } else {
            this.props.done()
        }
    }

    componentDidMount() {
        this.setState({visible: State.initial})
    }

    render({children, title, message, ...props}, {visible}) {
        return (
            <li class={cls('toast desktop animate', visible)}
                onAnimationEnd={this.animationEnd}>
                <h4>{localized(title)}</h4>
                <p>{localized(message)}</p>
            </li>
        )
    }
}

export class ToastManagerImpl {
    toasts: ToastProps[] = []

    constructor() {
        setTimeout(() => render(<Toasts/>, document.body), 10)
    }

    showToast = (props: ToastProps) => {
        const toast = {...props, done: () => ToastManager.removeToast(toast)}
        ToastManager.toasts.push(toast)
    }

    removeToast = (toast: ToastProps) => {
        console.log(this.toasts.indexOf(toast))
        ToastManager.toasts.splice(this.toasts.indexOf(toast), 1)
    }
}

const ToastManager = observable(new ToastManagerImpl())

@View
class Toasts extends QuillComponent {
    render() {
        return (
            <ul class="toast-manager">
                {ToastManager.toasts.map(props => <Toast {...props}/>)}
            </ul>
        )
    }
}

export {ToastManager}

