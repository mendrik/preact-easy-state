import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls, optional} from '../../util/utils'
import {RadioGroupContext} from './radio-group'
import './input-radio.pcss'
import {Icon} from '../icon/icon'

export interface InputRadioProps<T> extends FormProps<T> {
}

export interface InputRadioState {
    loaded?: boolean
}

@View
export class InputRadio<T> extends QuillComponent<InputRadioProps<T>, InputRadioState> {

    handleChange = () => {
        this.props.changes(this.props.value)
    }

    loaded = () => this.setState({loaded: true})

    onKeyDown = (ev: KeyboardEvent) => {
        const {key} = ev
        if (' ' === key) {
            ev.preventDefault()
            this.props.changes(this.props.value)
        }
    }

    render({children, changes, value, ...props}, {loaded}) {
        return (
            <RadioGroupContext.Consumer>{selected => {
                return (
                    <div class={cls('control radio-input', {loaded})} onAnimationEnd={this.loaded}>
                        <label tabIndex={0} onKeyDown={this.onKeyDown}>
                            <input type="radio"
                                   onClick={this.handleChange}
                                   value="dummy"
                                   {...optional('checked', 'checked', selected.selectedValue === value)}/>
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

