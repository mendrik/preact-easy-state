import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import './snap-scroll.pcss'

interface SnapScrollProps extends JSX.HTMLAttributes {
    onPanelChanged: (panel: number) => void
}

@View
export class SnapScroll extends QuillComponent<SnapScrollProps> {

    componentDidMount() {
        this.base.style.setProperty('--slides', `${this.props.children.length}`)
    }

    render({children, onPanelChanged, ...props}) {
        return (
            <div class="snap-scroll">
                <ul>{children}</ul>
            </div>
        )
    }
}
