import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-switch.pcss'
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
        onLabel: 'on',
        offLabel: 'disabled'
    }

    cssReady = () => {
        const labelWidth = this.base.querySelector('.label-off').getBoundingClientRect().width
        this.base.style.setProperty('--width', `${labelWidth}px`)
        this.setState({loaded: true})
    }

    render({children, changes, value, onLabel, offLabel, ...props}, {loaded = false}) {
        return (
            <div class={cls('control boolean-input', {loaded})} onAnimationEnd={this.cssReady}>
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

