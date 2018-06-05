import {Component, h} from 'preact'
import {View} from '../../decorators/view'
import {cls} from '../../util/utils'
import {localized} from '../../util/localization'
import './toast.pcss'

export enum ToastTheme {
    INFO = 'info',
    WARNING = 'warning',
    DANGER = 'danger'
}

export interface ToastProps {
    title?: string
    message?: string
    theme?: ToastTheme
    id?: string
}

@View
export class Toast extends Component<ToastProps> {

    close = () => {
        this.base.dispatchEvent(new CustomEvent('close-toast', {
            bubbles: true,
            detail: {
                id: this.props.id
            }
        }))
    }

    render({children, id, title, message, theme = ToastTheme.INFO, ...props}) {
        return (
            <li class={cls('toast', theme)} key={id} id={id}>
                <a className="delete is-small is-pulled-right" onClick={this.close}/>
                {title ? <h4>{localized(title)}</h4> : null}
                {message ? <p>{localized(message)}</p> : null}
                {children}
            </li>
        )
    }
}
