import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'

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

    leftIcon = () => (
        <span class="icon is-small is-left">
            <i class={`mdi mdi-${this.props.iconLeft}`}/>
        </span>
    )

    rightIcon = () => (
        <span class="icon is-small is-right">
            <i class={`mdi mdi-${this.props.iconRight}`}/>
        </span>
    )

    render({children, name, changes, mask, placeHolder, value, iconLeft, iconRight, ...props}) {
        return (
            <div class={cls('control', {mask, 'has-icons-left': iconLeft, 'has-icons-right': iconRight})}>
                <input type={this.getType()}
                       class="input is-small"
                       placeholder={placeHolder}
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
