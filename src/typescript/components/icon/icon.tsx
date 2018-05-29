import {Component, h} from 'preact'
import {cls, withClass} from '../../util/utils'

export interface IconProps extends JSX.HTMLAttributes {
    name: string
    left?: boolean
    right?: boolean
}

export class Icon extends Component<IconProps> {
    render({name, left = false, right = false, ...props}) {
        const defaultClasses = cls('icon is-small', {'is-left': left, 'is-right': right})
        return (
            <span {...withClass(props, defaultClasses)}>
                <i class={`mdi mdi-${name}`}/>
            </span>
        )
    }
}
