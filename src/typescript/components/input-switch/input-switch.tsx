import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-switch.pcss'
import {cls} from '../../util/utils'
import {CustomEvent} from '../../decorators/custom-event'

export interface InputSwitchProps extends FormProps<boolean> {
    onLabel?: string
    offLabel?: string
}

@View
export class InputSwitch extends QuillComponent<InputSwitchProps> {

    slider: HTMLDivElement
    loaded = false

    static defaultProps = {
        onLabel: 'enabled',
        offLabel: 'disabled'
    }

    @CustomEvent('animationstart')
    cssReady() {
        const {slider} = this
        const minWidth = slider.getBoundingClientRect().width
        this.setState({minWidth})
        this.loaded = true
    }

    render({children, changes, value, onLabel, offLabel, ...props}, {minWidth = 0}) {
        return (
            <div class={cls('control boolean-input', {loaded: this.loaded})}
                 style={`--min-width: ${minWidth}px`}
                 onClick={() => changes(!value)}>
                <div class={cls('switch-wrapper', {off: !value})}>
                    <div class="slider" ref={r => this.slider = r}>
                        <div class="on-label"><span>{onLabel}</span></div>
                        <div class="toggle"/>
                        <div class="off-label"><span>{offLabel}</span></div>
                    </div>
                </div>
                {children}
            </div>
        )
    }
}
