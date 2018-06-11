import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {PanX, PanXEventInit, Phase} from '../../decorators/pan-x'
import {LocalStorage, Store} from '../../decorators/local-storage'
import {observable} from '@nx-js/observer-util'
import './horizontal-split.pcss'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'

@LocalStorage
export class HorizontalSplitModel {
    @Store('horizontal-split.width') width: number
    dragging: boolean
}

@View
export class HorizontalSplit extends QuillComponent {

    model = observable(new HorizontalSplitModel())

    @PanX(() => '.handle')
    onPanX(ev: CustomEvent<PanXEventInit>) {
        const {phase, x} = {...ev.detail}
        if (phase === Phase.start) {
            this.model.dragging = true
        }
        else if (this.model.dragging && phase === Phase.move) {
            this.model.width = x
        }
        else {
            this.model.dragging = false
        }
    }

    render({children, ...props}) {
        if (children.length !== 2) {
            throw Error('Horizontal split needs two child components')
        }
        children[0].attributes = {...children[0].attributes, style: {width: `${this.model.width}px`}}
        return (
            <div class={cls('horizontal-split', {dragging: this.model.dragging})}>
                {children[0]}
                <div class="handle"/>
                {children[1]}
            </div>
        )
    }
}
