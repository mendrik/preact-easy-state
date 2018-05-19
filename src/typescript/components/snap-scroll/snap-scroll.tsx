import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'

interface SnapScrollProps extends JSX.HTMLAttributes {
    onPanelChanged: (panel: number) => void
}

@View
export class SnapScroll extends QuillComponent<SnapScrollProps> {

    render({children, onPanelChanged, ...props}) {
        return (
            <ul>{children}</ul>
        )
    }
}
