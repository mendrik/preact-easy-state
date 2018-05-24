import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import './masked-input.pcss'
import {View} from '../../decorators/view'
// import InputMask from 'react-input-mask'

export interface MaskedInputProps extends JSX.HTMLAttributes {
    mask: string
    maskChar?: string
    formatChars?: {[s: string]: string}
}

@View
export class MaskedInput extends QuillComponent<MaskedInputProps> {
    input: HTMLInputElement

    render({children, mask, formatChars, maskChar = '_', ...props}) {
        props.class = [...props.class.split(/\s+/), 'masked'].join(' ')
        return <input {...props}/>
    }
}
