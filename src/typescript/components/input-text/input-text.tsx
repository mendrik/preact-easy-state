import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'

@View
export class InputText extends QuillComponent {

    render({children, ...props}) {
        if (children.length !== 2) {
            throw Error('Horizontal split needs two child components')
        }
        return (
            <div class="horizontal-split">
                {children[0]}
                <div class="handle"/>
                {children[1]}
            </div>
        )
    }
}
