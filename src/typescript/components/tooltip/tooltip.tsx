import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import './tooltip.pcss'

export interface WithTooltipProps {
    tooltip: JSX.Element
}

export interface WithTooltipState {
    open: boolean
}

@View
export class WithTooltip extends QuillComponent<WithTooltipProps, WithTooltipState> {

    enter = () => this.setState({open: true})

    leave = () => this.setState({open: false})

    render({children, tooltip}, {open = false}) {
        return (
            <div class={cls('with-tooltip', {open})}
                    onMouseEnter={this.enter}
                    onMouseLeave={this.leave}>
                {children}
                {tooltip}
            </div>
        )
    }
}

@View
export class Tooltip extends QuillComponent<JSX.HTMLAttributes> {
    render({children, ...props}) {
        return (
            <div class="tooltip">
                {children}
            </div>
        )
    }
}
