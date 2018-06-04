import {Component, h} from 'preact'
import './toast.pcss'
import {observable} from '@nx-js/observer-util'
import {View} from '../../decorators/view'
import {cls} from '../../util/utils'
import 'animate.css/source/_base.css'
import 'animate.css/source/sliding_entrances/slideInLeft.css'
import 'animate.css/source/sliding_entrances/slideInUp.css'
import 'animate.css/source/sliding_exits/slideOutRight.css'
import 'animate.css/source/sliding_exits/slideOutDown.css'
import {QuillComponent} from '../../util/quill-component'
import {MediaQuery} from '../../decorators/media-query'
import {localized} from '../../util/localization'

export enum ToastTheme {
    INFO,
    WARNING,
    DANGER
}

export interface ToastProps {
    title: string
    message: string
    theme?: ToastTheme
}

export interface ToastState {
    visible: boolean
}

export class ToastManagerImpl {
    toasts: ToastProps[] = []

    showToast = (toast: ToastProps) => {
        this.toasts.push(toast)
    }

    removeToast = (toast: ToastProps) => this.toasts.splice(this.toasts.indexOf(toast), 1)
}

const ToastManager = observable(new ToastManagerImpl())

@View
class Toast extends QuillComponent<ToastProps, ToastState> {

    static defaultProps = {
        theme: ToastTheme.INFO
    }

    animationEnd = () => ToastManager.removeToast(this.props)

    @MediaQuery('(max-width:320px')
    mobile({children, title, message, ...props}, {visible}) {
        return (
        <li class={cls('toast mobile animate', {slideInUp: visible, slideOutDown: !visible})}
            onAnimationEnd={this.animationEnd}>
            <h4>{localized(title)}</h4>
            <p>{localized(message)}</p>
            {children}
        </li>)
    }

    @MediaQuery('(min-width:321px')
    desktop({children, title, message, ...props}, {visible}) {
        return (
        <li class={cls('toast desktop animate', {slideInLeft: visible, slideOutRight: !visible})}
            onAnimationEnd={this.animationEnd}>
            <h4>{localized(title)}</h4>
            <p>{localized(message)}</p>
            {children}
        </li>)
    }
}

@View
class Toasts extends Component {
    render() {
        return (
            <ul class="toast-manager">
                {ToastManager.toasts.map(props => <Toast {...props}/>)}
            </ul>
        )
    }
}

export {ToastManager, Toast, Toasts}
