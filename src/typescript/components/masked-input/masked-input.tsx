import {Component, h} from 'preact'
import './masked-input.pcss'
import InputMask from 'react-input-mask'

export interface MaskedInputProps extends JSX.HTMLAttributes {
    mask: string
    maskChar?: string
    formatChars?: {[s: string]: string}
}

export class MaskedInput extends Component<MaskedInputProps> {
    input: HTMLInputElement

    render({children, mask, formatChars, maskChar = '_', ...props}) {
        props.class = [...props.class.split(/\s+/), 'masked'].join(' ')
        return <InputMask {...props} alwaysShowMask={false} mask={mask} maskChar={maskChar} formatChars={formatChars}/>
    }
}
