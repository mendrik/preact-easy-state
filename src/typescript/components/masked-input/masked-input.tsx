import {Component, h} from 'preact'
import './masked-input.pcss'
import InputMask from 'react-input-mask'

export interface MaskedInputProps extends JSX.HTMLAttributes {
    mask: string
    maskChar?: string
    formatChars?: {[s: string]: string}
    alwaysShowMask?: boolean
}

export class MaskedInput extends Component<MaskedInputProps> {
    input: HTMLInputElement
    r: InputMask

    componentDidMount(): void {
        if (!this.r.forceUpdate) {
            console.error('compat not working')
        }
    }

    render({mask, formatChars, onChange, maskChar = '_', ...props}) {
        props.class = [...props.class.split(/\s+/), 'masked'].join(' ')
        return <InputMask ref={r => this.r = r}
                          {...props}
                          alwaysShowMask={false}
                          mask={mask}
                          maskChar={maskChar}
                          onBlur={onChange}
                          formatChars={formatChars}/>
    }
}
