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
import {SnapScroll, SnapScrollModel} from '../snap-scroll/snap-scroll'
import {Month} from './month'
import {range} from '../../util/utils'
import {ScrollPane} from '../scroll-pane/scrollpane'
import {InputText} from '../input-text/input-text'
import {setMonth, setYear} from 'date-fns'

interface DatePickerProps extends FormProps<Date> {
    error?: string
    format: string
}

class Model implements SnapScrollModel {
    currentMonth: Date
    selectedDate: Date
    dropDownVisible = false
    panel = 1

    constructor(currentMonth: Date) {
        this.currentMonth = currentMonth
    }
}

@View
export class DatePicker extends QuillComponent<DatePickerProps> {

    model: Model
    snapScroll: SnapScroll

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
        this.model.selectedDate = date
    }

    monthChanged = () => {
        if (this.model.panel === 0) {
            this.model.currentMonth = subMonths(this.model.currentMonth, 1)
        }
        if (this.model.panel === 2) {
            this.model.currentMonth = addMonths(this.model.currentMonth, 1)
        }
        this.model.panel = 1
    }

    previousMonth = () => subMonths(this.model.currentMonth, 1)
    nextMonth = () => addMonths(this.model.currentMonth, 1)

    render({children, name, changes, value, format, ...props}) {
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
                                {this.years()}
                                {this.months()}
                                <div class="date-time-picker">
                                    {this.header()}
                                    <SnapScroll onPanelChanged={this.monthChanged}
                                                ref={i => this.snapScroll = i}
                                                model={this.model}>
                                        <Month month={this.previousMonth()}
                                               onDateClick={this.dateClick}/>
                                        <Month month={this.model.currentMonth}
                                               selectedDate={this.model.selectedDate}
                                               onDateClick={this.dateClick}/>
                                        <Month month={this.nextMonth()}
                                               onDateClick={this.dateClick}/>
                                    </SnapScroll>
                                    {this.footer()}
                                </div>
                            </div>
                        </div>
                    </div>): null}
            </div>
        )
    }

    month = (month: number) => this.model.currentMonth = setMonth(this.model.currentMonth, month)

    months = () => {
        const months = range(0, 11).map(month =>
            <li onClick={() => this.month(month)}>{formatDate(new Date(2018, month, 1), 'MMM')}</li>
        )
        return <ul class="picker-section months">{months}</ul>
    }

    year = (year: number) => this.model.currentMonth = setYear(this.model.currentMonth, year)

    years = () => {
        const now = new Date()
        const years = range(1950, 2025).map(year =>
            <li class={os({'current-year': now.getFullYear() === year})}
                onClick={() => this.year(year)}>{year}</li>
        )
        return (
            <ScrollPane class="picker-section"
                        trackWidth={2}
                        scrollToSelector=".current-year">
                <ul class="years">{years}</ul>
            </ScrollPane>
        )
    }

    today = (ev: MouseEvent) => {
        this.model.currentMonth = this.model.selectedDate = new Date()
        const target = ev.target as HTMLButtonElement
        target.blur()
    }

    confirm = () => {
        const selected = this.model.selectedDate
        if (selected) {
            this.props.changes(selected)
        }
        this.model.dropDownVisible = false
    }

    footer = () => (
        <ul class="time-selector">
            <li><button class="button is-small" onClick={this.today}>Today</button></li>
            <li class="time">
                <InputText changes={() => 0}
                           iconRight="clock"
                           placeHolder="hh:mm"/>
            </li>
            <li><button class="button is-small is-primary"
                        onClick={this.confirm}>Ok</button></li>
        </ul>
    )


    prev = () => this.snapScroll.prev()
    next = () => this.snapScroll.next()

    header = () => (
        <ul class="picker-title">
            <li>
                <span class="icon" onClick={this.prev}><i class="mdi mdi-chevron-left"/></span>
            </li>
            <li class="current-date">{formatDate(this.model.currentMonth, 'MMMM YYYY')}</li>
            <li>
                <span class="icon" onClick={this.next}><i class="mdi mdi-chevron-right"/></span>
            </li>
        </ul>
    )
}
