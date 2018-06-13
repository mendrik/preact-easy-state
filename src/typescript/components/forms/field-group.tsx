import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {cls} from '../../util/utils'
import {localized} from '../../util/localization'

export interface FieldGroupProps extends JSX.HTMLAttributes {
    label: string
    alignBottom?: boolean
}

@View
export class FieldGroup extends QuillComponent<FieldGroupProps> {

    static defaultProps = {
        alignBottom: false
    }

    render({children, alignBottom, label, ...props}) {
        return (
            <div class={cls('field is-horizontal', {'align-bottom' : alignBottom})}>
                <div class="field-label is-small">
                    <label class="label">{localized(label)}</label>
                </div>
                <div class="field-body">
                    {children.map(control => <div class="field">{control}</div>)}
                </div>
            </div>
        )
    }
}
