import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {PanX, PanXEventInit, Phase} from '../../decorators/pan-x'
import {cls, range} from '../../util/utils'
import './input-slider.pcss'

export interface InputSliderProps extends FormProps<number> {
    min: number
    max: number
    steps: number
    softSlide?: boolean
    showScale?: boolean
}

export interface InputSliderState {
    drag: boolean
    rounding: boolean
    tooltipValue: number
}

@View
export class InputSlider extends QuillComponent<InputSliderProps, InputSliderState> {

    static defaultProps = {
        softSlide: false,
        showScale: true
    }

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
        const {value, min, max, softSlide} = this.props
        const tempValue = this.boxedValue(diffX)
        this.setState({tooltipValue: tempValue})
        if (softSlide) {
            const start = value - min
            const scale = max - min
            const fraction = (diffX - (start !== 0 ? scale / start : 0)) / width + start / scale
            return Math.min(1, Math.max(0, fraction)) * 100
        } else {
            return this.valueToPercent(tempValue)
        }
    }

    round = (diffX: number) => {
        this.setState({drag: false, rounding: this.props.softSlide})
        const boxed = this.boxedValue(diffX)
        this.props.changes(boxed)
        this.base.style.setProperty('--position', `${this.valueToPercent(boxed)}%`)
    }

    private boxedValue(diffX: number) {
        const {width} = this.dimensions
        const {min, max, steps, value} = this.props
        const rounded = Math.round(diffX / width * steps) / steps
        const normalized = rounded * (max - min) + value
        return Math.min(Math.max(normalized, min), max)
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
                this.setState({drag: true, rounding: false, tooltipValue: this.props.value})
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

    legend = () => {
        const {min, max, steps} = this.props
        const scale = (max - min) / steps
        return range(0, steps).map(i => <li>{i * scale + min}</li>)
    }

    render({showScale, min, max, value, changes, steps, ...props}, {drag, rounding, tooltipValue}) {
        return (
        <div class={cls('control slider-input', {drag, rounding})} onTransitionEnd={this.endTransition}>
            <div class="bar"/>
            <div class="handle">
                {drag ? <div class="tooltip mounted">{tooltipValue}</div> : null}
            </div>
            {showScale ? <ul class="legend">{this.legend()}</ul> : null}
        </div>)
    }
}
