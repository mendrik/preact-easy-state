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

    render({children, changes, value, onLabel, offLabel, ...props}, {loaded = false}) {
        return (
            <div class={cls('control boolean-input', {loaded})}>
                <label class="switch" ref={l => this.label = l}
                       tabIndex={0}
                       onKeyDown={onKey(this)}>
                    <input type="checkbox"
                           onClick={() => changes(!value)}
                           checked={value}/>
                    <div class="slider" ref={r => this.slider = r}>
                        <div class="label-off">{localized(offLabel)}</div>
                        <div class="toggle"/>
                        <div class="label-on">{localized(onLabel)}</div>
                    </div>
                </label>
                {children}
            </div>
        )
    }

}

