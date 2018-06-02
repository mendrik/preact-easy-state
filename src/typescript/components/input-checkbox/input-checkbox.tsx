import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls} from '../../util/utils'
import './input-checkbox.pcss'
import {showErrors, ValidationContext} from '../forms/form'

export interface InputSwitchProps extends FormProps<boolean> {
}

export interface InputSwitchState {
}

@View
export class InputCheckbox extends QuillComponent<InputSwitchProps, InputSwitchState> {

    render({children, changes, value, ...props}) {
        return (
            <ValidationContext.Consumer>{validation => {
                const errors = showErrors(validation, name)
                return (
                    <div class={cls('control checkbox-input')}>
                        <label tabIndex={0}>
                            <input type="checkbox"
                                   onClick={() => changes(!value)}
                                   checked={value}/>
                        </label>
                        {children}
                        {errors}
                    </div>)
            }}</ValidationContext.Consumer>
        )
    }

}

