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
    selector: string
}

export interface SnapScrollState {
    animate: boolean
}

@View
export class SnapScroll extends QuillComponent<SnapScrollProps, SnapScrollState> {

    static defaultProps = {
        timeThreshold: 150,
        pixelThreshold: 10
    }

    panel: HTMLUListElement

    componentDidMount() {
        this.base.style.setProperty('--slides', `${this.props.children.length}`)
    }

    @PanX((ss: SnapScroll) => ss.props.selector)
    panX1 = (ev: CustomEvent<PanXEventInit>) => {
        if (this.state.animate) {
            return
        }
        const {diffX, diffTime, phase} = ev.detail,
              {model, timeThreshold, pixelThreshold, children} = this.props
        switch (phase) {
            case Phase.start:
                this.setState({animate: false})
                break
            case Phase.move:
                this.panel.style.transform = `translateX(${-(100/children.length) * model.panel}%) translateX(${diffX}px)`
                break
            case Phase.end:
                if (!this.base) { // component was unmounted
                    return
                }
                const absDiffX = Math.abs(diffX)
                if (absDiffX !== 0) {
                    if ((diffTime < timeThreshold && absDiffX > pixelThreshold) ||
                        (absDiffX > this.base.getBoundingClientRect().width / 2)) {
                        model.panel += diffX < 0 ? 1 : -1
                    }
                    this.setState({animate: true})
                } else {
                    this.setState({animate: false})
                }
        }
    }

    @CustomEvent('tap')
    tapEnd() {
        this.setState({animate: false})
    }

    transitionEnd = () => {
        this.setState({animate: false})
        this.props.onPanelChanged()
    }

    next = () => {
        this.setState({animate: true})
        this.props.model.panel += 1
    }

    prev = () => {
        this.setState({animate: true})
        this.props.model.panel -= 1
    }

    render({children, model, selector, timeThreshold, pixelThreshold, onPanelChanged, ...props},
           {animate = false}) {
        const style = {
            transform: `translateX(${-(100/children.length) * model.panel}%)`
        }
        return (
            <div class={cls('snap-scroll', {animate})}>
                <ul class="months-panel" style={style}
                    ref={u => this.panel = u}
                    onTransitionEnd={this.transitionEnd}>
                    {children}
                </ul>
            </div>
        )
    }
}
