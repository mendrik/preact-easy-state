import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {PanX, PanXEventInit, Phase} from '../../decorators/pan-x'
import './horizontal-split.pcss'
import {LocalStorage, Store} from '../../decorators/local-storage'
import {observable} from '@nx-js/observer-util'

@LocalStorage
class Model {
    @Store('horizontal-split.width') width: number
    dragging: boolean
}

const model = observable(new Model())

@View
export class HorizontalSplit extends QuillComponent {

    componentDidMount() {
        this.applyWidth()
    }

    @PanX('.handle')
    onPanX(ev: CustomEvent<PanXEventInit>) {
        const {phase, x} = {...ev.detail}
        if (phase === Phase.start) {
            model.dragging = true
        }
        else if (model.dragging && phase === Phase.move) {
            model.width = x
            this.applyWidth()
        }
        else {
            model.dragging = false
        }
    }

    applyWidth() {
        const sideBar = this.base.firstElementChild as HTMLElement
        sideBar.style.width = `${model.width}px`
    }

    render({children, ...props}) {
        if (children.length !== 2) {
            throw Error('Horizontal split needs two child components')
        }
        return (
            <div class={`${model.dragging ? 'dragging' : ''} horizontal-split`}>
                {children[0]}
                <div class="handle"/>
                {children[1]}
            </div>
        )
    }
}
