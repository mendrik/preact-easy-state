import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import startOfWeek from 'date-fns/start_of_week'
import startOfMonth from 'date-fns/start_of_month'
import format from 'date-fns/format'
import {observable} from '@nx-js/observer-util'
import {range} from '../../util/utils'
import './month.pcss'
import addDays from 'date-fns/add_days'
import isSameDay from 'date-fns/is_same_day'
import {TapDate} from './tap-date'

export interface MonthProps {
    month: Date
    selectedDate?: Date
    onDateClick: (date: Date) => void
}

const DAYS_RANGE = range(0, 41)

export class Month extends QuillComponent<MonthProps> {

    constructor(props) {
        super(observable(props))
    }

    getDays = (month: Date) => {
        const date = startOfWeek(startOfMonth(month), {weekStartsOn: 1})
        return DAYS_RANGE.map(i => addDays(date, i))
    }

    render({month, selectedDate, onDateClick, ...props}) {
        const daysToRender = this.getDays(month)
        const weekDays = daysToRender.slice(0, 7).map(d => <li>{format(d, 'ddd')}</li>)
        const days = daysToRender.map(d =>
            <TapDate onDateClick={onDateClick}
                     date={d}
                     currentMonth={month}
                     selected={isSameDay(selectedDate, d)}/>
        )
        return (
            <li class="month">
                <ul class="weekdays">{weekDays}</ul>
                <ul class="days">{days}</ul>
            </li>
        )
    }
}
