import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {FormProps} from '../forms/types'
import {format as formatDate} from 'fecha'
import {observable} from '@nx-js/observer-util'
import './date-picker.pcss'
import os from 'obj-str'
import {DocumentClick} from '../../decorators/document-click'

interface DatePickerProps extends FormProps<Date> {
    error?: string
    format: string
}

class Model {
    currentMonth: Date
    dropDownVisible = false

    constructor(currentMonth: Date) {
        this.currentMonth = currentMonth
    }
}

@View
export class DatePicker extends QuillComponent<DatePickerProps> {

    model: Model

    constructor(props) {
        super(observable(props))
        this.model = observable(new Model(props.value))
    }

    iconClick = () => {
        this.model.dropDownVisible = !this.model.dropDownVisible
    }

    @DocumentClick((dp: DatePicker) => dp.model.dropDownVisible)
    closeDropDown() {
        this.model.dropDownVisible = false
    }

    render({children, name, changes, value, format, ...props}) {
        return (
            <div class={os({
                'control has-icons-right date-picker dropdown': 1,
                'is-active': this.model.dropDownVisible
            })}>
                <input type="text"
                       class="input is-small date"
                       name={name}
                       value={formatDate(value, format)}/>
                <span class="icon is-small is-right dropdown-trigger" onClick={this.iconClick}>
                    <i class="mdi mdi-calendar-range"/>
                </span>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                        Calendar goes<br/>here
                    </div>
                </div>
            </div>
        )
    }
}
