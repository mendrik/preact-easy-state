import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import './input-number.pcss'
import {format as Format, default as formatter} from 'format-number'
import {GlobalEvent} from '../../decorators/global-event'

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
    decimal: '.',
    round: 2
}

@View
export class InputNumber extends QuillComponent<InputNumberProps, InputNumberState> {

    format: Format
    input: HTMLInputElement

    static defaultProps = {
        integer: true,
        suffix: '',
        prefix: ''
    }

    constructor(props) {
        super(props)
        const {prefix, suffix, value} = props
        this.format = formatter({...formatConfig, prefix, suffix})
        this.state = {
            value
        }
    }

    validateKey = (ev: KeyboardEvent) => {
        const {ctrlKey, key} = ev
        if (!ctrlKey && key.length === 1) {
            if (!/[\d.]/.test(key)) {
                ev.preventDefault()
            }
        }
    }

    onChange = (ev: KeyboardEvent) => {
        const {ctrlKey, key} = ev
        if (!ctrlKey && /[1-9]/.test(key) || /backspace|delete/i.test(key)) {
            const {selectionStart, selectionEnd} = this.input
            const old =  this.format(this.state.value)
            const n = this.rawNumber()
            this.setState({value: n})
            this.forceUpdate(() => {
                if (old) {
                    const offset = this.format(n).length - old.length - 1
                    this.input.selectionStart = selectionStart + offset
                    this.input.selectionEnd = selectionEnd + offset
                }
            })
        }
    }

    rawNumber = () => {
        const str = this.input.value.replace(/,/,'.').replace(/[^\d.]/g, '')
        return this.props.integer ?
            parseInt(str, 10) :
            parseFloat(str)
    }

    copy = (ev) => {
        ev.preventDefault()
        ev.clipboardData.setData('text/plain', `${this.rawNumber()}`)
    }

    @GlobalEvent('selectionchange', document)
    selectionChange = (ev) => {
        const {props, input} = this
        if (document.activeElement === input) {
            const {prefix, suffix} = props
            input.selectionStart = Math.max(input.selectionStart, prefix.length)
            input.selectionEnd = Math.min(input.selectionEnd, input.value.length - suffix.length)
        }
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
                    onCopy={this.copy}
                    onKeyUp={this.onChange}
                    onKeyDown={this.validateKey}/>
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
