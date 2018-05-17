import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import './horizontal-split.pcss'

@View
export class HorizontalSplit extends QuillComponent {

    render({children, ...props}) {
        if (children.length !== 2) {
            throw Error('Horizontal split needs two child components')
        }
        return (
            <div class="horizontal-split">
                {children[0]}
                <div className="handle"/>
                {children[1]}
            </div>
        )
    }
}
