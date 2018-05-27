import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-switch.pcss'
import {cls} from '../../util/utils'

export interface InputSwitchProps extends FormProps<boolean> {
    onLabel?: string
    offLabel?: string
}

@View
export class InputSwitch extends QuillComponent<InputSwitchProps> {

    static defaultProps = {
        onLabel: 'this is on',
        offLabel: 'off'
    }

    componentDidMount() {
        const offLabelWidth = this.base.querySelector('.off-label').getBoundingClientRect().width
        const onLabelWidth = this.base.querySelector('.on-label').getBoundingClientRect().width
        this.base.style.setProperty('--off-width', `${offLabelWidth}px`)
        this.base.style.setProperty('--on-width', `${onLabelWidth}px`)
    }

    render({children, changes, value, onLabel, offLabel, ...props}) {
        return (
            <div class="control has-icons-right boolean-input">
                <div class={cls('switch-wrapper', {on: value})}>
                    <div class="slider">
                        <div class="on-label">{onLabel}</div>
                        <div class="toggle"/>
                        <div className="off-label">{offLabel}</div>
                    </div>
                </div>
                {children}
            </div>
        )
    }
}
