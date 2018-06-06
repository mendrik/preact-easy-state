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
        this.base.style.setProperty('--steps', `${this.props.steps}`)
    }

    nearest = (diffX: number) => {
        const {width} = this.dimensions
        return Math.min(Math.max(0, diffX / width * 100), 100)
    }

    round = (diffX: number) => {
        this.setState({drag: false, rounding: true})
        this.base.style.setProperty('--position', `${0}%`)
    }

    @PanX(() => '.handle')
    onDrag(ev: CustomEvent<PanXEventInit>) {
        const {phase, diffX} = ev.detail
        switch (phase) {
            case Phase.start:
                this.dimensions = this.base.getBoundingClientRect()
                this.setState({drag: true})
                break
            case Phase.move:
                this.base.style.setProperty(
                    '--position', `${this.nearest(diffX)}%`
                )
                break
            case Phase.end:
                this.round(diffX)
        }
    }

    endTransition = () => this.setState({rounding: false})

    render(props, {drag, rounding}) {
        return (
        <div class={cls('control slider-input', {drag, rounding})} onTransitionEnd={this.endTransition}>
            <div class="bar"/>
            <div class="handle"/>
        </div>)
    }
}
