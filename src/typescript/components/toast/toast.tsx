import {Component, h} from 'preact'
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

export interface Toast {
    title: string
    message: string
    extra?: JSX.Element
    theme?: ToastTheme
}

export interface ToastWithEnd {
    onAnimationEnd: (ev: AnimationEvent) => void
}

@View
export class ToastComp extends Component<Toast & ToastWithEnd> {

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
