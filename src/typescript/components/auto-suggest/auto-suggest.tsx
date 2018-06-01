import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {observable} from '@nx-js/observer-util'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'
import './auto-suggest.pcss'
import {DocumentClick} from '../../decorators/document-click'

export interface AutoSuggestProps<T> extends FormProps<T> {
    dataSourceUrl?: string
    renderer: (item: T) => JSX.Element
}

export class Model<T> {
    dropDownVisible = false
    items: T[]
}

@View
export class AutoSuggest<T> extends QuillComponent<AutoSuggestProps<T>> {

    model: Model<T>
    input: HTMLInputElement

    constructor(props) {
        super(props)
        this.model = observable(new Model<T>())
    }

    onInput = (ev) => {
        console.log(this.input.value)
    }

    openDropDown = (ev: Event) => {
        this.model.dropDownVisible = true
    }

    @DocumentClick((as: AutoSuggest<T>) => as.model.dropDownVisible)
    close() {
        this.model.dropDownVisible = false
    }

    render({children, dataSourceUrl, renderer, changes, value, ...props}) {
        const {dropDownVisible, items} = this.model
        return (
            <div class={cls('control has-icons-right auto-suggest dropdown', {
                'is-active': dropDownVisible
            })}>
                <input
                    ref={r => this.input = r}
                    type="text"
                    class="input is-small"
                    name={name}
                    onFocus={this.openDropDown}
                    onInput={this.onInput}
                    value={value}/>
                <Icon name="chevron-down" right={true} class="dropdown-trigger" onClick={this.openDropDown}/>
                {dropDownVisible ? (
                    <div class="dropdown-menu"
                         id="dropdown-menu"
                         tabIndex={-1}
                         role="menu">
                        <div class="dropdown-content">
                            {items ? <ul>{items.map(renderer)}</ul> : <span class="loading">Loading...</span>}
                        </div>
                    </div>): null}
            </div>
        )
    }
}
