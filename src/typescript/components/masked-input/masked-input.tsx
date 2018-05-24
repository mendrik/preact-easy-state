import {Component, h} from 'preact'
import './masked-input.pcss'
import InputMask from 'react-input-mask'

// make input mask work with preact
InputMask.prototype.forceUpdate = Component.prototype.forceUpdate

export interface MaskedInputProps extends JSX.HTMLAttributes {
    mask: string
    maskChar?: string
    formatChars?: {[s: string]: string}
    alwaysShowMask?: boolean
}

export class MaskedInput extends Component<MaskedInputProps> {
    input: HTMLInputElement

    render({mask, formatChars, maskChar = '_', ...props}) {
        props.class = [...props.class.split(/\s+/), 'masked'].join(' ')
        return <InputMask {...props}
                          alwaysShowMask={false}
                          mask={mask}
                          maskChar={maskChar}
                          formatChars={formatChars}/>
    }
}
