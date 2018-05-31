import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'
import {localized} from '../../util/localization'

export interface InputTextProps extends FormProps<string> {
    iconLeft?: string
    iconRight?: string
    error?: string
}

@View
export class InputText extends QuillComponent<InputTextProps> {

    getType = () => 'text'

    onChange = (ev: Event) => {
        this.props.changes((ev.target as HTMLInputElement).value)
    }

    leftIcon = () => <Icon name={this.props.iconLeft} left={true}/>

    rightIcon = () => <Icon name={this.props.iconRight} right={true}/>

    render({children, name, changes, mask, placeHolder, value, iconLeft, iconRight, ...props}) {
        return (
            <div class={cls('control', {mask, 'has-icons-left': iconLeft, 'has-icons-right': iconRight})}>
                <input type={this.getType()}
                       class="input is-small"
                       placeholder={localized(placeHolder)}
                       name={name}
                       value={value}
                       onChange={this.onChange}/>
                {iconLeft ? this.leftIcon() : null}
                {iconRight ? this.rightIcon() : null}
                {children}
            </div>
        )
    }
}
