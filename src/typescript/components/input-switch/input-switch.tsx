import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-switch.pcss'
import {CustomEvent} from '../../decorators/custom-event'
import {cls} from '../../util/utils'

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
        onLabel: 'enabled',
        offLabel: 'off'
    }

    hasCss = () => {
        const {slider, label} = this
        label.style.setProperty('--max-width', `${slider.offsetWidth}px`)
        this.setState({loaded: true})
    }

    render({children, changes, value, onLabel, offLabel, ...props}, {loaded = false}) {
        return (
            <div class={cls('control boolean-input', {loaded})} onAnimationEnd={this.hasCss} >
                <label class="switch" ref={l => this.label = l}>
                    <input type="checkbox" onClick={() => changes(!value)} checked={value}/>
                    <div class="slider" ref={r => this.slider = r}>
                        <div class="label-off">{offLabel}</div>
                        <div class="toggle"/>
                        <div class="label-on">{onLabel}</div>
                    </div>
                </label>
                {children}
            </div>
        )
    }

}

