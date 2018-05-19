import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {observable} from '@nx-js/observer-util'
import os from 'obj-str'
import './modal.pcss'

interface ModalProps  {
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
            <div class={os({'modal': 1, 'is-active': visible})}>
                <div class="modal-background"/>
                <div class="modal-content">
                    {children}
                </div>
                <button class="modal-close has-background-dark has-text-white" aria-label="close" onClick={onClose}/>
            </div>) : null
    }
}
