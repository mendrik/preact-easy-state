import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'
import {localized} from '../../util/localization'
import {showErrors, ValidationContext} from '../forms/form'

export interface InputTextProps extends FormProps<string> {
    iconLeft?: string
    iconRight?: string
    error?: string
    type?: string
}

@View
export class InputText extends QuillComponent<InputTextProps> {

    static defaultProps = {
        type: 'text'
    }

    onChange = (ev: Event) => {
        this.props.changes((ev.target as HTMLInputElement).value)
    }

    leftIcon = () => <Icon name={this.props.iconLeft} left={true}/>

    rightIcon = () => <Icon name={this.props.iconRight} right={true}/>

    render({children, name, changes, type, mask, disabled, placeHolder, value, iconLeft, iconRight, ...props}) {
        return (
            <ValidationContext.Consumer>{validation => {
                const errors = showErrors(validation, name)
                return (
                    <div class={cls('control input-text', {mask, 'has-icons-left': iconLeft, 'has-icons-right': iconRight})}>
                        <input type={type}
                               class={cls('input is-small', {error: errors})}
                               placeholder={localized(placeHolder)}
                               name={name}
                               disabled={disabled}
                               value={value}
                               onChange={this.onChange}/>
                        {iconLeft ? this.leftIcon() : null}
                        {iconRight ? this.rightIcon() : null}
                        {children}
                        {errors}
                    </div>)
            }}</ValidationContext.Consumer>
        )
    }
}
