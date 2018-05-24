import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {PanX, PanXEventInit, Phase} from '../../decorators/pan-x'
import './snap-scroll.pcss'
import {CustomEvent} from '../../decorators/custom-event'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'

export interface SnapScrollModel {
    panel: number
}

export interface SnapScrollProps extends JSX.HTMLAttributes {
    model: SnapScrollModel
    onPanelChanged: () => void
    timeThreshold?: number
    pixelThreshold?: number
}

export interface SnapScrollState {
    animate: boolean
    diffX: number
}

@View
export class SnapScroll extends QuillComponent<SnapScrollProps, SnapScrollState> {

    static defaultProps = {
        timeThreshold: 150,
        pixelThreshold: 10
    }

    componentDidMount() {
        this.base.style.setProperty('--slides', `${this.props.children.length}`)
    }

    @PanX('.months-panel > li.month:nth-child(2)')
    panX1 = (ev: CustomEvent<PanXEventInit>) => {
        if (this.state.animate) {
            return
        }
        const {diffX, diffTime, phase} = ev.detail,
              {model, timeThreshold, pixelThreshold} = this.props
        switch (phase) {
            case Phase.start:
                this.setState({animate: false})
                break
            case Phase.move:
                this.setState({diffX})
                break
            case Phase.end:
                const absDiffX = Math.abs(diffX)
                if (absDiffX !== 0) {
                    if ((diffTime < timeThreshold && absDiffX > pixelThreshold) ||
                        (absDiffX > this.base.getBoundingClientRect().width / 2)) {
                        model.panel += diffX < 0 ? 1 : -1
                    }
                    this.setState({animate: true, diffX: 0})
                } else {
                    this.setState({animate: false, diffX: 0})
                }
        }
    }

    @CustomEvent('tap')
    tapEnd() {
        this.setState({animate: false, diffX: 0})
    }

    transitionEnd = () => {
        this.setState({animate: false})
        this.props.onPanelChanged()
    }

    next = () => {
        this.setState({animate: true, diffX: 0})
        this.props.model.panel += 1
    }

    prev = () => {
        this.setState({animate: true, diffX: 0})
        this.props.model.panel -= 1
    }

    render({children, model, timeThreshold, pixelThreshold, onPanelChanged, ...props},
           {animate = false, diffX = 0}) {
        const style = {
            transform: `translateX(${-(100/children.length) * model.panel}%) translateX(${diffX}px)`
        }
        return (
            <div class={cls('snap-scroll', {animate})}>
                <ul class="months-panel" style={style}
                    onTransitionEnd={this.transitionEnd}>
                    {children}
                </ul>
            </div>
        )
    }
}
