import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-switch.pcss'

export interface InputSwitchProps extends FormProps<boolean> {
    onLabel?: string
    offLabel?: string
}

@View
export class InputSwitch extends QuillComponent<InputSwitchProps> {

    static defaultProps = {
        onLabel: 'on',
        offLabel: 'off'
    }

    render({children, changes, ...props}) {
        return (
            <div class="control has-icons-right boolean-input">
                {children}
            </div>
        )
    }
}
