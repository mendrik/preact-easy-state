import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import format from 'date-fns/esm/format'
import './month.pcss'
import {CustomEvent} from '../../decorators/custom-event'
import isSameDay from 'date-fns/esm/isSameDay'
import isSameMonth from 'date-fns/esm/isSameMonth'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'

export interface TabDateProps {
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
            <li class={cls('date', {
                out: !isSameMonth(currentMonth, date),
                selected,
                today: isSameDay(date, TapDate.today)})}>
                <div>{format(date, 'd')}</div>
            </li>
        )
    }
}
