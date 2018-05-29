import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import formatDate from 'date-fns/esm/format'
import parseDate from 'date-fns/esm/parse'
import {observable} from '@nx-js/observer-util'
import './date-picker.pcss'
import addMonths from 'date-fns/esm/addMonths'
import subMonths from 'date-fns/esm/subMonths'
import {DocumentClick} from '../../decorators/document-click'
import {SnapScroll, SnapScrollModel} from '../snap-scroll/snap-scroll'
import {Month} from './month'
import {cls, range} from '../../util/utils'
import {ScrollPane} from '../scroll-pane/scrollpane'
import addYears from 'date-fns/esm/addYears'
import setMonth from 'date-fns/esm/setMonth'
import setYear from 'date-fns/esm/setYear'
import subYears from 'date-fns/esm/subYears'
import {MaskedInput} from '../masked-input/masked-input'
import {View} from '../../decorators/view'
import setHours from 'date-fns/esm/setHours'
import setMinutes from 'date-fns/esm/setMinutes'
import {InView} from '../in-view/in-view'
import {Icon} from '../icon/icon'

export interface DatePickerProps extends FormProps<Date> {
    error?: string
    format: string
    withTime?: boolean
    withMonths?: boolean
}

export class Model implements SnapScrollModel {
    currentMonth: Date
    selectedDate: Date
    dropDownVisible = false
    panel = 1
    timeChanged = false
    dateChanged = false

    constructor(currentMonth: Date) {
        this.currentMonth = currentMonth
    }
}

const timeInput = {
    '1': '[0-2]',
    '2': '[0-9]',
    '3': '[0-5]',
    '4': '[0-9]',
}

const dateInput = {
    'd': '[0-3]',
    'm': '[0-1]',
    '9': '[0-9]',
}

@View
export class DatePicker extends QuillComponent<DatePickerProps> {

    model: Model
    snapScroll: SnapScroll
    yearScroll: ScrollPane
    dropDown: HTMLDivElement

    constructor(props) {
        super(observable(props))
        this.model = observable(new Model(props.value))
    }

    iconClick = () => {
        this.model.currentMonth = this.props.value
        this.model.dropDownVisible = !this.model.dropDownVisible
        if (!this.model.dropDownVisible) {
            this.model.panel = 1
        } else {
            setTimeout(() => this.dropDown.focus(), 10)
        }
    }

    @DocumentClick((dp: DatePicker) => dp.model.dropDownVisible)
    closeDropDown() {
        this.model.dropDownVisible = false
        this.model.panel = 1
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

    keyDown = (ev: KeyboardEvent) => {
        const newDate = (() => {
            switch (ev.key) {
                case 'ArrowUp': return subYears(this.model.currentMonth, 1)
                case 'ArrowDown': return addYears(this.model.currentMonth, 1)
                case 'ArrowLeft': return subMonths(this.model.currentMonth, 1)
                case 'ArrowRight': return addMonths(this.model.currentMonth, 1)
                default: return
            }
        })()
        if (newDate && ev.target === this.dropDown) {
            ev.preventDefault()
            this.model.currentMonth = newDate
        }
    }

    dateChanged = (ev) => {
        this.model.selectedDate = this.dateFromStr(ev.target.value)
        this.props.changes(this.model.selectedDate)
    }

    dateFromStr = (str: string, defaultDate: Date = new Date(), format = this.props.format): Date => {
        const d = parseDate(str, format, defaultDate)
        return isNaN(d.getTime()) ? defaultDate : d
    }

    timeChanged = (ev) => {
        const d = this.dateFromStr(ev.target.value, new Date(), 'HH:mm')
        this.model.currentMonth = setHours(this.model.currentMonth, d.getHours())
        this.model.currentMonth = setMinutes(this.model.currentMonth, d.getMinutes())
        this.model.timeChanged = true
    }

    render({children, name, withMonths, withTime, changes, value, format, ...props}) {
        return (
            <div class={cls('control has-icons-right date-picker dropdown', {
                'is-active': this.model.dropDownVisible,
                'with-time': withTime
            })}>
                <MaskedInput
                    mask={format.replace(/dd/, 'd9').replace(/MM/, 'm9').replace(/\w/ig, '9')}
                    type="text"
                    class={cls('input is-small date', {changed: this.model.dateChanged})}
                    name={name}
                    placeholder={format}
                    onChange={this.dateChanged}
                    onAnimationEnd={this.dateHighlightEnded}
                    formatChars={dateInput}
                    value={formatDate(value, format)}/>
                <Icon name="calendar-range" right={true} class="dropdown-trigger" onClick={this.iconClick}/>
                {this.model.dropDownVisible ? (
                    <div class="dropdown-menu"
                         id="dropdown-menu"
                         tabIndex={-1}
                         ref={r => this.dropDown = r}
                         onKeyDown={this.keyDown}
                         role="menu">
                        <InView class="dropdown-content">
                            <div class="selector-elements">
                                {withMonths ? [this.years(), this.months()] : null}
                                <div class="date-time-picker">
                                    {this.header()}
                                    <SnapScroll onPanelChanged={this.monthChanged}
                                                selector=".months-panel > li.month:nth-child(2)"
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
                                    {this.footer(withTime, this.model.currentMonth)}
                                </div>
                                {withTime ? [this.hours(), this.minutes()] : null}
                            </div>
                        </InView>
                    </div>): null}
            </div>
        )
    }

    month = (month: number) => this.model.currentMonth = setMonth(this.model.currentMonth, month)

    months = () => {
        const active = this.model.currentMonth
        const months = range(0, 11).map(month =>
            <li onClick={() => this.month(month)}
                class={cls({active: active.getMonth() === month})}>
                {formatDate(new Date(2018, month, 1), 'MMM')}
            </li>
        )
        return <ul class="picker-section months">{months}</ul>
    }

    year = (year: number) => {
        this.model.currentMonth = setYear(this.model.currentMonth, year)
        this.yearScroll.scrollToSelector()
    }

    years = () => {
        const now = this.model.currentMonth
        const years = range(now.getFullYear() - 80, now.getFullYear() + 20).map(year =>
            <li class={cls({'current-year': now.getFullYear() === year})}
                onClick={() => this.year(year)}>{year}</li>
        )
        return (
            <ScrollPane ref={s => this.yearScroll = s}
                        class="picker-section"
                        trackWidth={2}
                        scrollToSelector=".current-year">
                <ul class="years">{years}</ul>
            </ScrollPane>
        )
    }

    hour = (hour: number) => {
        this.model.currentMonth = setHours(this.model.currentMonth, hour)
        this.model.timeChanged = true
    }

    hours = () => {
        const hours = range(0, 23).map(hour => {
            const hh = formatDate(new Date(2018, 1, 1, hour), 'HH')
            return (
                <li class={`hour-${hh}`} onClick={() => this.hour(hour)}>
                    {hh}
                </li>)
            }
        )
        return (
            <ScrollPane class="picker-section"
                        scrollToSelector=".hour-14"
                        trackWidth={2}>
                <ul class="picker-section hours">{hours}</ul>
            </ScrollPane>
        )
    }

    minute = (minute: number) => {
        this.model.currentMonth = setMinutes(this.model.currentMonth, minute)
        this.model.timeChanged = true
    }

    minutes = () => {
        const minutes = range(0, 11).map(minute =>
            <li onClick={() => this.minute(minute * 5)}>
                {formatDate(new Date(2018, 1, 1, 0, minute * 5), ':mm')}
            </li>
        )
        return (
            <ul class="picker-section minutes">{minutes}</ul>
        )
    }

    today = (ev: MouseEvent) => {
        this.model.currentMonth = this.model.selectedDate = new Date()
        const target = ev.target as HTMLButtonElement
        target.blur()
    }

    confirm = () => {
        let selected = this.model.selectedDate || this.model.currentMonth
        selected = setHours(selected, this.model.currentMonth.getHours())
        selected = setMinutes(selected, this.model.currentMonth.getMinutes())
        this.props.changes(selected)
        this.model.dropDownVisible = false
        this.model.dateChanged = true
    }

    timeHighlightEnded = () => this.model.timeChanged = false
    dateHighlightEnded = () => this.model.dateChanged = false

    footer = (withTime: boolean, value: Date) => (
        <ul class="time-selector">
            <li><button class="button is-small" onClick={this.today}>Today</button></li>
            <li class="time">
                {withTime ? (
                <div class="control has-icon-right">
                    <MaskedInput
                        type="text"
                        class={cls('input is-small', {changed: this.model.timeChanged})}
                        placeholder="hh:mm"
                        formatChars={timeInput}
                        value={formatDate(value, 'HH:mm')}
                        onChange={this.timeChanged}
                        onAnimationEnd={this.timeHighlightEnded}
                        mask="12:34"/>
                    <Icon name="clock" right={true}/>
                </div>): null}
            </li>
            <li><button class="button is-small is-primary"
                        onClick={this.confirm}>Ok</button></li>
        </ul>
    )


    prev = () => this.snapScroll.prev()
    next = () => this.snapScroll.next()

    header = () => (
        <ul class="picker-title">
            <li><Icon name="chevron-left" onClick={this.prev}/></li>
            <li class="current-date">{formatDate(this.model.currentMonth, 'MMMM YYYY')}</li>
            <li><Icon name="chevron-right" onClick={this.next}/></li>
        </ul>
    )
}
