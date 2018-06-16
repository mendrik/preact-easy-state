import {navigate} from '../../decorators/router'
import {h, Component} from 'preact'

export interface LinkProps {
    to: string
}

export class Link extends Component<LinkProps> {

    onClick = (ev) => {
        ev.preventDefault()
        navigate(this.props.to)
    }

    render({to, children, ...props}) {
        return <a href={to} {...props} onClick={this.onClick}>{children}</a>
    }
}
