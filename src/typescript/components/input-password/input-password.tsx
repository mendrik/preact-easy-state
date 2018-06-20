import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls} from '../../util/utils'
import {Icon} from '../icon/icon'
import {localized} from '../../util/localization'
import {showErrors, ValidationContext} from '../forms/form'
import './input-password.pcss'
import {View} from '../../decorators/view'

export interface InputPasswordProps extends FormProps<string> {
    big?: boolean
}

export interface InputPasswordState {
    revealPassword: boolean
}

@View
export class InputPassword extends QuillComponent<InputPasswordProps, InputPasswordState> {

    input: HTMLInputElement

    onChange = () => {
        this.props.changes(this.input.value)
    }

    toggle = () => {
        const {revealPassword} = this.state
        this.setState({revealPassword: !revealPassword})
    }

    render({children, name, changes, disabled, big, placeHolder, value, ...props}, {revealPassword}) {
        return (
            <ValidationContext.Consumer>{validation => {
                const errors = showErrors(validation, name)
                return (
                    <div class="control password-input has-icons-left has-icons-right">
                        <input type={revealPassword ? 'text' : 'password'}
                               ref={i => this.input = i}
                               class={cls('input', {error: errors, 'is-small': !big})}
                               placeholder={localized(placeHolder)}
                               name={name}
                               disabled={disabled}
                               value={value}
                               onChange={this.onChange}/>
                        <Icon name="key" left={true}/>
                        <Icon name={revealPassword? 'eye-off-outline' : 'eye-outline'}
                              right={true}
                              onClick={this.toggle}/>
                        {children}
                        {errors}
                    </div>)
            }}</ValidationContext.Consumer>
        )
    }
}
