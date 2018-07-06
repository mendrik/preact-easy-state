import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import './modal.pcss'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import 'animate.css/source/_base.css'
import 'animate.css/source/fading_entrances/fadeInDown.css'
import 'animate.css/source/fading_exits/fadeOutUp.css'
import {localized} from '../../util/localization'

export interface ModalProps {
    onClose: () => void
    title?: string
}

export interface ModalState {
    visible: boolean
}

@View
export class Modal extends QuillComponent<ModalProps, ModalState> {

    componentDidMount() {
        this.setState({visible: true})
        this.base.focus()
    }

    close = () => {
        this.setState({visible: false})
    }

    animationEnd = () => {
        if (!this.state.visible) {
            this.props.onClose()
        }
    }

    keyDown = (ev) => {
        if (ev.key === 'Escape') {
            this.close()
        }
    }

    render({children, title, onClose, ...props}, {visible}) {
        return (
            <div class={cls('modal is-active')}
                 onKeyDown={this.keyDown}
                 tabIndex={-1}>
                <div class="modal-background" onClick={this.close}/>
                <div class={cls('modal-content animated', {fadeInDown: visible, fadeOutUp: !visible})}
                     onAnimationEnd={this.animationEnd}>
                    <button class="modal-close has-text-white"
                            aria-label="close"
                            onClick={this.close}/>
                    <div class="box">
                        {title ? <h4>{localized(title)}</h4> : null}
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}
