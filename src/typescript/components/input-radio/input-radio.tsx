import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls, optional} from '../../util/utils'
import {RadioGroupContext} from './radio-group'
import './input-radio.pcss'
import {Icon} from '../icon/icon'

export interface InputSwitchProps<T> extends FormProps<T> {
}

@View
export class InputRadio<T> extends QuillComponent<InputSwitchProps<T>> {

    handleChange = () => {
        this.props.changes(this.props.value)
    }

    render({children, changes, value, ...props}) {
        return (
            <RadioGroupContext.Consumer>{selected => {
                return (
                    <div class={cls('control radio-input')}>
                        <label>
                            <input type="radio"
                                   onClick={this.handleChange}
                                   value="dummy"
                                   {...optional('checked', 'checked', selected === value)}/>
                            <div class="tick-box">
                                <Icon name="circle" big={true}/>
                            </div>
                            <span class="label">{children}</span>
                        </label>
                    </div>)
            }}</RadioGroupContext.Consumer>
        )
    }

}

