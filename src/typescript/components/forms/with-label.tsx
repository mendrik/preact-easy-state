import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {localized} from '../../util/localization'

export interface WithLabelProps extends JSX.HTMLAttributes {
    name: string
}

@View
export class WithLabel extends QuillComponent<WithLabelProps> {

    render({children, name, ...props}) {
        return (
            <div class="field">
                <label class="label is-small">{localized(name)}</label>
                {children}
            </div>
        )
    }
}
