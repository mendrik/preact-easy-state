import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls, optional} from '../../util/utils'
import './input-checkbox.pcss'

export interface InputSwitchProps extends FormProps<boolean> {
}

export interface InputSwitchState {
}

@View
export class InputCheckbox extends QuillComponent<InputSwitchProps, InputSwitchState> {

    render({children, changes, value, ...props}) {
        return (
            <div class={cls('control checkbox-input')}>
                <label class="switch" tabIndex={0}>
                    <input type="checkbox"
                           {...optional('onClick', () => changes(!value), changes)}
                           checked={value}/>
                </label>
                {children}
            </div>
        )
    }

}

