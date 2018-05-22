import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import './masked-input.pcss'

interface MaskedInputProps extends JSX.HTMLAttributes {
    mask: string
}

export class MaskedInput extends QuillComponent<MaskedInputProps> {

    componentWillMount(): void {
        // todo
    }

    render({children, mask, ...props}) {
        props.class = [...props.class.split(/\s+/), 'masked'].join(' ')
        return <input {...props}/>
    }
}
