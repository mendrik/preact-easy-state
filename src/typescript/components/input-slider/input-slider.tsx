import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-slider.pcss'

export interface InputSliderProps extends FormProps<number> {
    minLabel: string
    maxLabel: string
    min: number
    max: number
    step?: number
}

@View
export class InputSlider extends QuillComponent<InputSliderProps> {

    constructor(props) {
        super(props)
    }

    render({children, value, changes, minLabel, maxLabel, min, max, step, ...props}) {
        return (
        <div class="control slider-input">
            {children}
        </div>)
    }
}
