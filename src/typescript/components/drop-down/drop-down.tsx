import {Component, h} from 'preact'
import {cls} from '../../util/utils'
import {DocumentClick} from '../../decorators/document-click'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'
import {localized} from '../../util/localization'
import {observable} from '@nx-js/observer-util'
import './drop-down.pcss'

export interface DropDownItem {
    text: string
    onClick: () => void
    divider: boolean
}

export interface DropDownProps extends JSX.HTMLAttributes {
    text: string
    disabled?: boolean
}

export interface DropDownState {
    open: boolean
}

@View
export class DropDown extends Component<DropDownProps, DropDownState> {

    constructor(props) {
        super(props)
        this.state = observable({
            open: false
        })
    }

    toggle = () => this.setState({open: !this.state.open})

    @DocumentClick((d: DropDown) => d.state.open)
    close = () => this.setState({open: false})

    maybeClose = (ev: MouseEvent) => {
        const target = ev.target as HTMLElement
        if (target.matches('.dropdown-item')) {
            this.close()
        }
    }

    render({children, text, disabled, ...props}, {open}) {
        return (
            <div class={cls('control dropdown', {'is-active': open})}>
                <div class="dropdown-trigger">
                    <button class="button is-small is-fullwidth" onClick={this.toggle} disabled={disabled}>
                        <span>{localized(text)}</span>
                        <Icon name="chevron-down"/>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content" onClick={this.maybeClose}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}

export interface DropDownItemProps extends JSX.HTMLAttributes {
    onClick: () => void
}

export class DropDownItem extends Component<DropDownItemProps> {

    click = (ev: MouseEvent) => {
        ev.preventDefault()
        this.props.onClick()
    }

    render({children, onClick}) {
        return (
            <a href="#" class="dropdown-item is-size-7" onClick={this.click}>
                {children}
            </a>
        )
    }
}

export class DropDownDivider extends Component {
    render() {
        return <hr class="dropdown-divider"/>
    }
}

