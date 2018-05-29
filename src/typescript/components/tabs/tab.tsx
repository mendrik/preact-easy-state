import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'

export interface TabProps extends JSX.HTMLAttributes {
    icon?: string
    text: string
    active?: boolean
    click?: () => void
}

@View
export class Tab extends QuillComponent<TabProps> {

    render({icon, text, active, click, ...props}) {
        return (
            <li class={cls({'is-active': active})}>
                <a onClick={click}>
                    {icon ? <Icon name={icon}/> : null}
                    <span>{text}</span>
                </a>
            </li>
        )
    }
}
