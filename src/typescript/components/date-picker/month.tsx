import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import startOfWeek from 'date-fns/start_of_week'
import startOfMonth from 'date-fns/start_of_iso_week'
import format from 'date-fns/format'
import {observable} from '@nx-js/observer-util'
import {range} from '../../util/utils'
import './month.pcss'

interface MonthProps {
    month: Date
    onDateClick: (date: Date) => void
}

@View
export class Month extends QuillComponent<MonthProps> {

    getDays = (month: Date) => {
        console.log(startOfMonth(month))
        const date = startOfWeek(startOfMonth(month))
        return range(0, 42).map(i =>
            new Date(date.getFullYear(), date.getMonth(), date.getDay() + i)
        )
    }

    constructor(props) {
        super(observable(props))
    }

    render({month, ...props}) {
        const daysToRender = this.getDays(month)
        const weekDays = daysToRender.slice(0, 6).map(d => <li>{format(d, 'dd')}</li>)
        const days = daysToRender.map(d => <li>{format(d, 'D')}</li>)
        return (
            <li class="month">
                <ul class="weekdays">{weekDays}</ul>
                <ul class="days">{days}</ul>
            </li>
        )
    }
}
