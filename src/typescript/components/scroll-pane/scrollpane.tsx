import {h} from 'preact'
import './scrollpane.pcss'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {WindowEvent} from '../../decorators/window-event'
import {DomChanged} from '../../decorators/dom-changed'
import {scrollBarWidth} from '../../util/utils'
import os from 'obj-str'

@View
export class ScrollPane extends QuillComponent<JSX.HTMLAttributes> {

    componentDidMount() {
        this.base.style.setProperty('--scrollbar-width', `${scrollBarWidth()}px`)
        requestAnimationFrame(() => this.calculateThumb())
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

    render({children, ...props}) {
        const className = props.class
        props.class = os({[className]: className, scrollpane: 1})
        return (
            <div {...props}>
                <div class="inner-scroll-pane"
                     onScroll={this.calculateThumb}>{children}</div>
                <div class="track"><div class="thumb"/></div>
            </div>
        )
    }
}
