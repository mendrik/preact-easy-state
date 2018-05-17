import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {HorizontalSplit} from '../../components/horizontal-split/horizontal-split'

@View
export class MainPage extends QuillComponent {

    render() {
        return (
            <div>
                <span>MainPage</span>
                <HorizontalSplit>
                    <div>Left</div>
                    <div>Right</div>
                </HorizontalSplit>
            </div>
        )
    }
}
