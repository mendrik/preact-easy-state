import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {FormProps} from '../forms/types'
import os from 'obj-str'

interface InputTextProps extends FormProps<string> {
    iconLeft?: string
    iconRight?: string
    error?: string
    value?: string
}

@View
export class InputText extends QuillComponent<InputTextProps> {

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

    render({children, name, changes, value, iconLeft, iconRight, ...props}) {
        return (
            <div class={os({control: 1, 'has-icons-left': iconLeft, 'has-icons-right': iconRight})}>
                <input type="text"
                       class="input is-small"
                       name={name}
                       value={value}
                       onChange={this.onChange}/>
                {iconLeft ? this.leftIcon() : null}
                {iconRight ? this.rightIcon() : null}
            </div>
        )
    }
}
