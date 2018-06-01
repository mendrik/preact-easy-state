import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-switch.pcss'
import {cls, optional} from '../../util/utils'
import {localized} from '../../util/localization'

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

    cssReady = () => {
        const labelWidth = this.base.querySelector('.label-off').getBoundingClientRect().width
        this.base.style.setProperty('--width', `${labelWidth}px`)
        this.setState({loaded: true})
    }

    render({children, changes, value, onLabel, offLabel, error, ...props}, {loaded = false}) {
        return (
            <div class={cls('control boolean-input', {loaded, error})} onAnimationEnd={this.cssReady}>
                <label class="switch" ref={l => this.label = l}>
                    <input type="checkbox"
                           {...optional('onClick', () => changes(!value), changes)}
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

