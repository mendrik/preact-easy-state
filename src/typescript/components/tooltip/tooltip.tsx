import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import './tooltip.pcss'
import os from 'obj-str'
import {extendVNode} from '../../util/nvode-extension'

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
            <div class={os({'with-tooltip': 1, open})}
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
            <div class={os({tooltip:1})}>
                {children}
            </div>
        )
    }
}
