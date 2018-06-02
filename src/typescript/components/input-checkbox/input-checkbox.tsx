import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls, optional} from '../../util/utils'
import {showErrors, ValidationContext} from '../forms/form'
import './input-checkbox.pcss'
import {Icon} from '../icon/icon'

export interface InputSwitchProps extends FormProps<boolean> {
}

export interface InputSwitchState {
}

@View
export class InputCheckbox extends QuillComponent<InputSwitchProps, InputSwitchState> {

    handleChange = (ev) => {
        this.props.changes(ev.target.checked)
    }

    render({children, changes, value, ...props}) {
        return (
            <ValidationContext.Consumer>{validation => {
                const errors = showErrors(validation, name)
                return (
                    <div class={cls('control checkbox-input')}>
                        <label>
                            <input type="checkbox"
                                   onClick={this.handleChange}
                                   value="dummy"
                                   {...optional('checked', 'checked', value)}/>
                            <div class="tick-box">
                                <Icon name="check" big={true}/>
                            </div>
                            <span class="label">{children}</span>
                        </label>
                        {errors}
                    </div>)
            }}</ValidationContext.Consumer>
        )
    }

}

