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
            <div className="field is-horizontal">
                <div className="field-label is-small">
                    <label className="label">{label}</label>
                </div>
                <div className="field-body">
                    {children.map(control => <div className="field">{control}</div>)}
                </div>
            </div>
        )
    }
}
