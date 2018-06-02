import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls, optional} from '../../util/utils'
import {showErrors, ValidationContext} from '../forms/form'
import {Icon} from '../icon/icon'
import './input-checkbox.pcss'

export interface InputCheckboxProps extends FormProps<boolean> {
}

export interface InputCheckboxState {
    loaded?: boolean
}

@View
export class InputCheckbox extends QuillComponent<InputCheckboxProps, InputCheckboxState> {

    handleChange = (ev) => {
        this.props.changes(ev.target.checked)
    }

    loaded = () => this.setState({loaded: true})

    onKeyDown = (ev: KeyboardEvent) => {
        const {key} = ev
        if (' ' === key) {
            ev.preventDefault()
            this.props.changes(!this.props.value)
        }
    }

    render({children, changes, value, ...props}, {loaded}) {
        return (
            <ValidationContext.Consumer>{validation => {
                const errors = showErrors(validation, name)
                return (
                    <div class={cls('control checkbox-input', {loaded})} onAnimationEnd={this.loaded}>
                        <label tabIndex={0} onKeyDown={this.onKeyDown}>
                            <input type="checkbox"
                                   onClick={this.handleChange}
                                   value="dummy"
                                   {...optional('checked', 'checked', value)}/>
                            <div class="tick-box">
                                <Icon name="check" big={true}/>
                            </div>
                            <span class="label">{children}</span>
                        </label>
                        {errors}
                    </div>)
            }}</ValidationContext.Consumer>
        )
    }

}

