import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {PanX, PanXEventInit, Phase} from '../../decorators/pan-x'
import {cls, range} from '../../util/utils'
import './input-slider.pcss'
import {Key, onKey} from '../../decorators/on-key'

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

    dimensions: ClientRect
    handle: HTMLLabelElement

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
        const tempValue = this.boxedValue(diffX, true)
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

    round = (diffX: number, withValue = true) => {
        this.setState({drag: false, rounding: this.props.softSlide})
        const boxed = this.boxedValue(diffX, withValue)
        this.props.changes(boxed)
        this.base.style.setProperty('--position', `${this.valueToPercent(boxed)}%`)
    }

    private boxedValue(diffX: number, withValue) {
        const {width} = this.dimensions
        const {min, max, steps, value} = this.props
        const rounded = Math.round(diffX / width * steps) / steps
        const normalized = rounded * (max - min) + (withValue ? value : 0)
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
                this.handle.focus()
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
                if (Math.abs(diffX) > 5) {
                    this.handle.blur()
                }
        }
    }

    endTransition = () => this.setState({drag: false, rounding: false})

    click = (ev: MouseEvent) => {
        this.round(ev.clientX - this.dimensions.left, false)
/*
        const {changes, value, min, max, steps} = this.props
        const newValue = Math.min(Math.max(min, value + dir * (max - min) / steps), max)
        changes(newValue)
        this.base.style.setProperty(
            '--position', `${this.valueToPercent(newValue)}%`
        )
*/

    }

    legend = () => {
        const {min, max, steps} = this.props
        const scale = (max - min) / steps
        return range(0, steps).map(i => <li>{i * scale + min}</li>)
    }

    moveStep = (dir: number) => {
        const {changes, value, min, max, steps} = this.props
        const newValue = Math.min(Math.max(min, value + dir * (max - min) / steps), max)
        changes(newValue)
        this.base.style.setProperty(
            '--position', `${this.valueToPercent(newValue)}%`
        )
    }

    @Key('ArrowLeft')
    arrowLeft() {
        this.moveStep(-1)
    }

    @Key('ArrowRight')
    arrowRight() {
        this.moveStep(1)
    }

    render({showScale, min, max, value, changes, steps, ...props}, {drag, rounding, tooltipValue}) {
        return (
        <div class={cls('control slider-input', {drag, rounding})}
             onTransitionEnd={this.endTransition}>
            <div class="bar" onClick={this.click}/>
            <label class="handle" tabIndex={0} onKeyDown={onKey(this)} ref={h => this.handle = h}>
                <input type="hidden"/>
                {drag ? <div class="tooltip mounted">{tooltipValue}</div> : null}
            </label>
            {showScale ? <ul class="legend">{this.legend()}</ul> : null}
        </div>)
    }
}
