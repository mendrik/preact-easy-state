import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import startOfWeek from 'date-fns/start_of_week'
import startOfMonth from 'date-fns/start_of_month'
import format from 'date-fns/format'
import {observable} from '@nx-js/observer-util'
import {range} from '../../util/utils'
import './month.pcss'

interface MonthProps {
    month: Date
    onDateClick: (date: Date) => void
}

const DAYS_RANGE = range(0, 42)

@View
export class Month extends QuillComponent<MonthProps> {

    constructor(props) {
        super(observable(props))
    }

    getDays = (month: Date) => {
        const date = startOfWeek(startOfMonth(month), {weekStartsOn: 1})
        return DAYS_RANGE.map(i =>
            new Date(date.getFullYear(), date.getMonth(), date.getDay() + i)
        )
    }

    render({month, onDateClick, ...props}) {
        const daysToRender = this.getDays(month)
        const weekDays = daysToRender.slice(0, 7).map(d => <li>{format(d, 'ddd')}</li>)
        const days = daysToRender.map(d => <li onClick={() => onDateClick(d)}>{format(d, 'D')}</li>)
        return (
            <li class="month">
                <ul class="weekdays">{weekDays}</ul>
                <ul class="days">{days}</ul>
            </li>
        )
    }
}
