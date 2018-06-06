import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-slider.pcss'
import {PanX, PanXEventInit, Phase} from '../../decorators/pan-x'
import {cls} from '../../util/utils'

export interface InputSliderProps extends FormProps<number> {
    minLabel: string
    maxLabel: string
    min: number
    max: number
    steps: number
}

export interface InputSliderState {
    drag: boolean
    rounding: boolean
}

@View
export class InputSlider extends QuillComponent<InputSliderProps, InputSliderState> {

    private dimensions: ClientRect

    componentDidMount() {
        this.setDimensions()
        this.base.style.setProperty('--steps', `${this.props.steps}`)
        this.base.style.setProperty('--position', `${this.valueToPercent(this.props.value)}%`)
    }

    valueToPercent = (value) => {
        const {min, max, steps} = this.props
        const boxed = Math.max(min, Math.min(max, value))
        const fraction = (boxed - min) / (max - min)
        return Math.round(fraction * steps) / steps * 100
    }

    boxedPercent = (diffX: number) => {
        const {width} = this.dimensions
        const {value, min, max} = this.props
        const start = value - min
        const scale = max - min
        const fraction = (diffX - width / start) / width + start / scale
        return Math.min(1, Math.max(0, fraction)) * 100
    }

    round = (diffX: number) => {
        this.setState({drag: false, rounding: true})
        const {width} = this.dimensions
        const {min, max, steps, value} = this.props
        const rounded = Math.round(diffX / width * steps) / steps
        const normalized = rounded * (max - min) + value
        const boxed = Math.min(Math.max(normalized, min), max)
        this.props.changes(boxed)
        this.base.style.setProperty('--position', `${this.valueToPercent(boxed)}%`)
    }

    setDimensions = () => {
        this.dimensions = this.base.getBoundingClientRect()
    }

    @PanX(() => '.handle')
    onDrag(ev: CustomEvent<PanXEventInit>) {
        const {phase, diffX} = ev.detail
        switch (phase) {
            case Phase.start:
                this.setDimensions()
                this.setState({drag: true, rounding: false})
                break
            case Phase.move:
                this.base.style.setProperty(
                    '--position', `${this.boxedPercent(diffX)}%`
                )
                break
            case Phase.end:
                this.round(diffX)
        }
    }

    endTransition = () => this.setState({drag: false, rounding: false})

    render(props, {drag, rounding}) {
        return (
        <div class={cls('control slider-input', {drag, rounding})} onTransitionEnd={this.endTransition}>
            <div class="bar"/>
            <div class="handle"/>
        </div>)
    }
}
