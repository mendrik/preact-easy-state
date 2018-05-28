import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'

export interface FieldGroupProps extends JSX.HTMLAttributes {
    label: string
}

@View
export class FieldGroup extends QuillComponent<FieldGroupProps> {

    render({children, label, ...props}) {
        return (
            <div class="field is-horizontal">
                <div class="field-label is-small">
                    <label class="label">{label}</label>
                </div>
                <div class="field-body">
                    {children.map(control => <div class="field">{control}</div>)}
                </div>
            </div>
        )
    }
}
