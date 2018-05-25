import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-number.pcss'
import {format as Format, default as formatter} from 'format-number'

export interface InputNumberState {
    value: number
}

export interface InputNumberProps extends FormProps<number> {
    error?: string
    integer?: boolean
    prefix?: string
    suffix?: string
}

const formatConfig = {
    integerSeparator: '\u00B7',
    decimalsSeparator: '',
    decimal: ',',
    round: 2
}

@View
export class InputNumber extends QuillComponent<InputNumberProps, InputNumberState> {

    format: Format
    input: HTMLInputElement

    static defaultProps = {
        integer: true
    }

    constructor(props) {
        super(props)
        const {prefix, suffix, value} = props
        this.format = formatter({...formatConfig, prefix, suffix})
        this.state = {
            value
        }
    }

    onChange = (ev: KeyboardEvent) => {
        if (!ev.ctrlKey && !/[,.]/.test(ev.key)) {
            const n = this.rawNumber()
            this.setState({value: n})
            this.forceUpdate()
        }
    }

    rawNumber = () => {
        const str = this.input.value.replace(/,/,'.').replace(/[^\d\.]/g, '')
        return this.props.integer ?
            parseInt(str, 10) :
            parseFloat(str)
    }

    focus = () => {
        // setTimeout(this.setCursor, 100)
    }

    copy = (ev) => {
        ev.preventDefault()
        ev.clipboardData.setData('text/plain', `${this.rawNumber()}`)
    }

    setCursor = () => {
        const pos = this.rawNumberText().length + 2
        this.input.selectionStart = pos
        this.input.selectionEnd = pos
    }

    rawNumberText = () => {
        const {suffix, prefix} = this.props
        return this.format(this.state.value).replace(suffix, '').replace(prefix, '')
    }

    shouldComponentUpdate() {
        return false
    }

    confirm = (ev: FocusEvent) => {
        this.forceUpdate()
       // this.props.changes(this.state.value)
    }

    render({children, changes, integer, placeHolder, ...props}, {value}) {
        return (
            <div class="control two-icons has-icons-right number-input">
                <input
                    ref={i => this.input =i}
                    type="text"
                    class="input is-small"
                    value={this.format(value)}
                    onBlur={this.confirm}
                    onFocus={this.focus}
                    onCopy={this.copy}
                    onKeyUp={this.onChange}/>
                {integer ? (
                    <span className="icon is-small is-right">
                        <i className="mdi mdi-chevron-up"/>
                    </span>): null}
                {integer ? (
                    <span className="icon is-small is-right">
                        <i className="mdi mdi-chevron-down"/>
                    </span>): null}
                {children}
            </div>
        )
    }
}
