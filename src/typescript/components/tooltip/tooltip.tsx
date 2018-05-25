import {Component, h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {cls} from '../../util/utils'
import './tooltip.pcss'
import {MountedWithDelay} from '../../decorators/mounted-with-delay'
import {View} from '../../decorators/view'

export interface WithTooltipProps {
    tooltip: JSX.Element
}

export interface WithTooltipState {
    open: boolean
}

export class WithTooltip extends Component<WithTooltipProps, WithTooltipState> {

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

export interface TooltipState {
    mounted: boolean
}

@View
export class Tooltip extends QuillComponent<JSX.HTMLAttributes, TooltipState> {

    @MountedWithDelay(500)
    onMount() {
        setTimeout(() => this.setState({mounted: true}))
    }

    render({children, ...props}, {mounted = false}) {
        return (
            <div class={cls('tooltip', {mounted})}>
                {children}
            </div>
        )
    }
}
