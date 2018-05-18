import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import os from 'obj-str'

interface TabProps extends JSX.HTMLAttributes {
    icon?: string
    text: string
    active?: boolean
    click?: () => void
}

@View
export class Tab extends QuillComponent<TabProps> {

    render({icon, text, active, click, ...props}) {
        return (
            <li class={os({'is-active': active})}>
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
