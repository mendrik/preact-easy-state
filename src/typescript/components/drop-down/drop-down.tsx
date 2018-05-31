import {Component, h} from 'preact'
import {cls} from '../../util/utils'
import {DocumentClick} from '../../decorators/document-click'
import {View} from '../../decorators/view'
import {observable} from '@nx-js/observer-util'
import {Icon} from '../icon/icon'
import {localized} from '../../util/localization'

export interface DropDownItem {
    text: string
    onClick: () => void
    divider: boolean
}

export interface DropDownProps extends JSX.HTMLAttributes {
    text: string
}

export class Model {
    open = false
}

@View
export class DropDown extends Component<DropDownProps> {

    model: Model

    constructor(props) {
        super(props)
        this.model = observable(new Model())
    }

    toggle = () => this.model.open = !this.model.open

    @DocumentClick((d: DropDown) => d.model.open)
    close = () => this.model.open = false

    maybeClose = (ev: MouseEvent) => {
        const target = ev.target as HTMLElement
        if (target.matches('.dropdown-item')) {
            this.close()
        }
    }

    render({children, text, ...props}) {
        return (
            <div class={cls('control dropdown', {'is-active': this.model.open})}>
                <div class="dropdown-trigger">
                    <button class="button is-small is-fullwidth" onClick={this.toggle}>
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

