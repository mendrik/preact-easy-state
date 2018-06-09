import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-switch.pcss'
import {cls} from '../../util/utils'
import {localized} from '../../util/localization'
import {Key, onKey} from '../../decorators/on-key'

export interface InputSwitchProps extends FormProps<boolean> {
    onLabel?: string
    offLabel?: string
}

export interface InputSwitchState {
    loaded: boolean
}

@View
export class InputSwitch extends QuillComponent<InputSwitchProps, InputSwitchState> {

    label: HTMLLabelElement
    slider: HTMLDivElement

    static defaultProps = {
        onLabel: 'on',
        offLabel: 'off'
    }

    @Key(' ')
    onSpace = () => {
        this.props.changes(!this.props.value)
    }

    render({children, changes, value, onLabel, offLabel, disabled, ...props}, {loaded = false}) {
        return (
            <div class={cls('control boolean-input', {loaded})}>
                <label class={cls('switch', {disabled})} ref={l => this.label = l}
                       tabIndex={disabled ? null : 0}
                       onKeyDown={onKey(this)}>
                    <input type="checkbox"
                           onClick={() => changes(!value)}
                           checked={value}/>
                    <div class="slider" ref={r => this.slider = r}>
                        <div class="label-off" data-on={localized(onLabel)}>
                            {localized(offLabel)}
                            <span>{localized(onLabel)}</span>
                        </div>
                        <div class="toggle"/>
                    </div>
                </label>
                {children}
            </div>
        )
    }

}

