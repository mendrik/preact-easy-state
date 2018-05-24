import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {observable} from '@nx-js/observer-util'
import './modal.pcss'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'

export interface ModalProps  {
    visible: boolean
    onClose: () => void
}

@View
export class Modal extends QuillComponent<ModalProps> {

    constructor(props) {
        super(observable(props))
    }

    render({children, onClose, visible, ...props}) {
        return visible ? (
            <div class={cls('modal', {'is-active': visible})}>
                <div class="modal-background"/>
                <div class="modal-content">
                    {children}
                </div>
                <button class="modal-close has-background-dark has-text-white" aria-label="close" onClick={onClose}/>
            </div>) : null
    }
}
