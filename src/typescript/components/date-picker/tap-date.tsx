import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import format from 'date-fns/format'
import './month.pcss'
import {CustomEvent} from '../../decorators/custom-event'
import {View} from '../../decorators/view'
import os from 'obj-str'
import {isSameDay, isSameMonth} from 'date-fns'

interface TabDateProps {
    onDateClick: (date: Date) => void
    date: Date
    currentMonth: Date
    selected: boolean
}

@View
export class TapDate extends QuillComponent<TabDateProps> {

    static today = new Date()

    @CustomEvent('tap')
    onTap = () => {
        this.props.onDateClick(this.props.date)
    }

    render({date, currentMonth, selected, ...props}) {
        return (
            <li class={os({
                date: 1,
                out: !isSameMonth(currentMonth, date),
                selected,
                today: isSameDay(date, TapDate.today)})}>
                <div>{format(date, 'D')}</div>
            </li>
        )
    }
}
