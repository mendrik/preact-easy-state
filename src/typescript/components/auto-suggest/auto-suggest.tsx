import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {observable} from '@nx-js/observer-util'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {InView} from '../in-view/in-view'
import {Icon} from '../icon/icon'
import './auto-suggest.pcss'

export interface AutoSuggestProps extends FormProps<string> {
}

class Model {
    dropDownVisible = false
}

@View
export class AutoSuggest extends QuillComponent<AutoSuggestProps> {

    model: Model
    input: HTMLInputElement

    constructor(props) {
        super(props)
        this.model = observable(new Model())
    }

    onInput = (ev) => {
        console.log(this.input.value)
    }

    openDropDown = (ev: Event) => {
        this.model.dropDownVisible = true
    }

    render({children, name, withMonths, withTime, changes, value, format, ...props}) {
        return (
            <div class={cls('control has-icons-right auto-suggest dropdown', {
                'is-active': this.model.dropDownVisible
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
                {this.model.dropDownVisible ? (
                    <div class="dropdown-menu"
                         id="dropdown-menu"
                         tabIndex={-1}
                         role="menu">
                        <InView class="dropdown-content">
                            Searching...
                        </InView>
                    </div>): null}
            </div>
        )
    }
}
