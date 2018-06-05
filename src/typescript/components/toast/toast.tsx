import {cloneElement, Component, h, render} from 'preact'
import {observable} from '@nx-js/observer-util'
import {View} from '../../decorators/view'
import {cls} from '../../util/utils'
import {QuillComponent} from '../../util/quill-component'
import {localized} from '../../util/localization'
import './toast.pcss'

export enum ToastTheme {
    INFO,
    WARNING,
    DANGER
}

export interface ToastProps {
    title: string
    message: string
    extra?: JSX.Element
    theme?: ToastTheme
    onAnimationEnd?: (ev: AnimationEvent) => void
}

@View
export class Toast extends Component<ToastProps> {

    static defaultProps = {
        theme: ToastTheme.INFO
    }

    render({children, onAnimationEnd, extra, title, message, ...props}) {
        return (
            <li class={cls('toast')} onAnimationEnd={onAnimationEnd}>
                <h4>{localized(title)}</h4>
                <p>{localized(message)}</p>
                {extra}
            </li>
        )
    }
}

export class Model {
    toasts?: ToastProps[] = []
}

@View
export class Toasts extends QuillComponent<Model> {

    model: Model

    constructor(props) {
        super(props)
        this.model = observable(new Model())
    }

    showToast = (toast: ToastProps) => {
        this.model.toasts.push(toast)
    }

    animationEnd = (toast: ToastProps) => () => {
        const toasts = this.model.toasts
        toasts.splice(toasts.indexOf(toast), 1)
    }

    render() {
        return (
            <ul class="toast-manager">
                {this.model.toasts.map(props =>
                    <Toast {...props} onAnimationEnd={this.animationEnd(props)}/>)}
            </ul>
        )
    }
}
