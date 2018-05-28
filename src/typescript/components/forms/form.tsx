import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import './form.pcss'

export interface FormProps extends JSX.HTMLAttributes {
}

@View
export class Form extends QuillComponent<FormProps> {

    render({children, label, ...props}) {
        return (
            <div class="form-group">
                {children}
            </div>
        )
    }
}
