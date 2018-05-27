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

@View
export class InputSwitch extends QuillComponent<InputSwitchProps> {

    static defaultProps = {
        onLabel: 'this is on',
        offLabel: 'off'
    }

    componentDidMount(): void {
        const {base, base: {style}} = this
        const slider = base.querySelector('.slider') as HTMLDivElement
        const minWidth = slider.getBoundingClientRect().width
        console.log(minWidth)
        style.setProperty('--min-width', `${Math.round(minWidth)}px`)
    }

    render({children, changes, value, onLabel, offLabel, ...props}) {
        return (
            <div class="control has-icons-right boolean-input" onClick={() => changes(!value)}>
                <div class={cls('switch-wrapper', {on: value})}>
                    <div class="slider">
                        <div class="on-label"><span>{onLabel}</span></div>
                        <div class="toggle"/>
                        <div className="off-label"><span>{offLabel}</span></div>
                    </div>
                </div>
                {children}
            </div>
        )
    }
}
