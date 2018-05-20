import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import './snap-scroll.pcss'

interface SnapScrollProps extends JSX.HTMLAttributes {
    onPanelChanged: (panel: number) => void
    panel: number
}

@View
export class SnapScroll extends QuillComponent<SnapScrollProps> {

    componentDidMount() {
        this.base.style.setProperty('--slides', `${this.props.children.length}`)
    }

    render({children, panel, onPanelChanged, ...props}) {
        const style = {transform: `translateX(-${panel * 100})%`}
        return (
            <div class="snap-scroll" style={style}>
                <ul>{children}</ul>
            </div>
        )
    }
}
