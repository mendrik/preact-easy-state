import {Component, h} from 'preact'
import {cls, withClass} from '../../util/utils'

export interface IconProps extends JSX.HTMLAttributes {
    name: string
    left?: boolean
    right?: boolean
    big?: boolean
}

export class Icon extends Component<IconProps> {
    render({name, big = false, left = false, right = false, ...props}) {
        const defaultClasses = cls('icon', {'is-small': !big, 'is-left': left, 'is-right': right})
        return (
            <span {...withClass(props, defaultClasses)}>
                <i class={`mdi mdi-${name}`}/>
            </span>
        )
    }
}
