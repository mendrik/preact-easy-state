import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {PanX, PanXEventInit, Phase} from '../../decorators/pan-x'
import './horizontal-split.pcss'
import {LocalStorage, Store} from '../../decorators/local-storage'
import {observable} from '@nx-js/observer-util'
import os from 'obj-str'

@LocalStorage
class Model {
    @Store('horizontal-split.width') width: number
    dragging: boolean
}

@View
export class HorizontalSplit extends QuillComponent {

    model = observable(new Model())

    @PanX('.handle')
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
            <div class={os({dragging: this.model.dragging, 'horizontal-split': 1})}>
                {children[0]}
                <div class="handle"/>
                {children[1]}
            </div>
        )
    }
}
