import {Component, h} from 'preact'
import './masked-input.pcss'
import InputMask from 'react-input-mask'
import {withClass} from '../../util/utils'

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

    render({mask, formatChars, onChange, maskChar = '_', ...props}) {
        return <InputMask {...withClass(props, 'masked')}
                          alwaysShowMask={false}
                          mask={mask}
                          maskChar={maskChar}
                          onBlur={onChange}
                          formatChars={formatChars}/>
    }
}
