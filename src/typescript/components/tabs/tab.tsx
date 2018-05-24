import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {cls} from '../../util/utils'

export interface TabProps extends JSX.HTMLAttributes {
    icon?: string
    text: string
    active?: boolean
    click?: () => void
}

export class Tab extends QuillComponent<TabProps> {

    render({icon, text, active, click, ...props}) {
        return (
            <li class={cls({'is-active': active})}>
                <a onClick={click}>
                    {icon ? (
                        <span class="icon is-small">
                            <i class={`mdi mdi-${icon}`} aria-hidden="true"/>
                        </span>) : null}
                    <span>{text}</span>
                </a>
            </li>
        )
    }
}
