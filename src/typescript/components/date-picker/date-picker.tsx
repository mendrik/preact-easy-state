import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {FormProps} from '../forms/types'
import formatDate from 'date-fns/format'
import {observable} from '@nx-js/observer-util'
import './date-picker.pcss'
import addMonths from 'date-fns/add_months'
import subMonths from 'date-fns/sub_months'
import os from 'obj-str'
import {DocumentClick} from '../../decorators/document-click'
import {SnapScroll} from '../snap-scroll/snap-scroll'
import {Month} from './month'
import {range} from '../../util/utils'
import {ScrollPane} from '../scroll-pane/scrollpane'
import {InputText} from '../input-text/input-text'
import {InputNumber} from '../input-number/input-number'

interface DatePickerProps extends FormProps<Date> {
    error?: string
    format: string
}

class Model {
    currentMonth: Date
    dropDownVisible = true

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

    dateClick = (date: Date) => {
        console.log(date)
    }

    monthChanged = (panel: number) => {
        console.log(panel)
    }

    previousMonth = () => subMonths(this.model.currentMonth, 1)
    nextMonth = () => addMonths(this.model.currentMonth, 1)

    render({children, name, changes, value, format, ...props}) {
        const now = new Date()
        const years = range(1950, 2025).map(year =>
            <li class={os({'current-year': now.getFullYear() === year})}>{year}</li>
        )
        const months = range(0, 11).map(month =>
            <li>{formatDate(new Date(2018, month, 1), 'MMM')}</li>
        )
        return (
            <div class={os({
                'control has-icons-right date-picker dropdown': 1,
                'is-active': this.model.dropDownVisible})}>
                <input type="text"
                       class="input is-small date"
                       name={name}
                       value={formatDate(value, format)}/>
                <span class="icon is-small is-right dropdown-trigger" onClick={this.iconClick}>
                    <i class="mdi mdi-calendar-range"/>
                </span>
                {this.model.dropDownVisible ? (
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <div class="selector-elements">
                                <ScrollPane class="picker-section"
                                            trackWidth={2}
                                            scrollToSelector=".current-year">
                                    <ul class="years">{years}</ul>
                                </ScrollPane>
                                <ul class="picker-section months">{months}</ul>
                                <div class="date-time-picker">
                                    <div class="title">March, 1st 2018</div>
                                    <SnapScroll onPanelChanged={this.monthChanged}>
                                        <Month month={this.previousMonth()}
                                               onDateClick={this.dateClick}/>
                                        <Month month={this.model.currentMonth}
                                               onDateClick={this.dateClick}/>
                                        <Month month={this.nextMonth()}
                                               onDateClick={this.dateClick}/>
                                    </SnapScroll>
                                    <ul class="time-selector">
                                        <li><button class="button is-small">Today</button></li>
                                        <li class="time">
                                            <InputText changes={() => 0}
                                                         iconRight="clock"
                                                         placeHolder="hh:mm"/>
                                        </li>
                                        <li><button class="button is-small is-primary">Ok</button></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>): null}
            </div>
        )
    }
}
