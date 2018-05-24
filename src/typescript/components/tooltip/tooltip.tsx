import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import './tooltip.pcss'
import {cls} from '../../util/utils'

export interface WithTooltipProps {
    tooltip: JSX.Element
}

export interface WithTooltipState {
    open: boolean
}

export class WithTooltip extends QuillComponent<WithTooltipProps, WithTooltipState> {

    enter = () => this.setState({open: true})
    leave = () => this.setState({open: false})

    render({children, tooltip}, {open}) {
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

export class Tooltip extends QuillComponent<JSX.HTMLAttributes> {
    render({children, ...props}) {
        return (
            <div class="tooltip">
                {children}
            </div>
        )
    }
}
