import {Component, h} from 'preact'
import {View} from '../../decorators/view'
import {cls} from '../../util/utils'
import {localized} from '../../util/localization'
import './toast.pcss'

export enum ToastTheme {
    INFO,
    WARNING,
    DANGER
}

export interface ToastProps {
    title?: string
    message?: string
    theme?: ToastTheme
}

@View
export class Toast extends Component<ToastProps> {

    render({children, title, message, theme = ToastTheme.INFO, ...props}) {
        return (
            <li class={cls('toast', theme)}>
                {title ? <h4>{localized(title)}</h4> : null}
                {message ? <p>{localized(message)}</p> : null}
                {children}
            </li>
        )
    }
}
