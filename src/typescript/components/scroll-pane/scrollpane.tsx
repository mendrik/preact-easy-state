import {h} from 'preact'
import './scrollpane.pcss'
import {QuillComponent} from '../../util/quill-component'
import {WindowEvent} from '../../decorators/window-event'
import {DomChanged} from '../../decorators/dom-changed'
import {cls, scrollBarWidth} from '../../util/utils'
import {observable} from '@nx-js/observer-util'
import {CustomEvent as OnCustomEvent} from '../../decorators/custom-event'
import {View} from '../../decorators/view'

export class Model {
    hover = false
}

export interface ScrollPaneProps extends JSX.HTMLAttributes {
    trackWidth: number
    scrollToSelector?: string // todo scroll to this on mount
}

@View
export class ScrollPane extends QuillComponent<ScrollPaneProps> {

    model: Model

    constructor(props) {
        super(props)
        this.model = observable(new Model())
    }

    componentDidMount() {
        const base = this.base
        const {trackWidth} = this.props
        base.style.setProperty('--scrollbar-width', `${scrollBarWidth()}px`)
        base.style.setProperty('--track-width', `${trackWidth}px`)
        requestAnimationFrame(() => {
            this.calculateThumb()
            this.scrollToSelector()
        })
    }

    scrollToSelector = () => {
        const base = this.base
        const {scrollToSelector} = this.props
        if (scrollToSelector) {
            const element = base.querySelector(scrollToSelector) as HTMLDivElement
            const top = element.offsetTop + element.clientHeight / 2
            base.firstElementChild.scrollTop = top - base.getBoundingClientRect().height / 2
        }
    }

    @DomChanged((el) => el.firstElementChild)
    @WindowEvent('resize')
    calculateThumb = () => {
        const el = this.base
        const inner = el.firstElementChild
        const thumbTop = inner.scrollTop * (inner.clientHeight / inner.scrollHeight)
        let thumbHeight = (inner.clientHeight / inner.scrollHeight * 100)
        if (thumbHeight >= 100) {
            thumbHeight = 0
        }
        el.style.setProperty('--thumb-top', `${thumbTop.toFixed(2)}px`)
        el.style.setProperty('--thumb-height', `${thumbHeight.toFixed(2)}%`)
    }

    @OnCustomEvent('scrollIn')
    mouseEnter = () => {
        this.model.hover = true
        this.base.parentElement.dispatchEvent(new CustomEvent('scrollOut', {bubbles: true, scoped: true}))
    }

    @OnCustomEvent('scrollOut')
    mouseLeave = () => {
        this.model.hover = false
        this.base.parentElement.dispatchEvent(new CustomEvent('scrollIn', {bubbles: true, scoped: true}))
    }

    render({children, trackWidth, ...props}) {
        const className = props.class
        props.class = cls('scrollpane', {[className]: className, hover: this.model.hover})
        props.onMouseEnter = this.mouseEnter
        props.onMouseLeave = this.mouseLeave
        return (
            <div {...props}>
                <div class="inner-scroll-pane"
                     onScroll={this.calculateThumb}>{children}</div>
                <div class="track"><div class="thumb"/></div>
            </div>
        )
    }
}
