import {Component, h} from 'preact'
import {localized} from '../../util/localization'
import './form.pcss'

export interface HintProps {
    text?: string
}

export class WithHint extends Component<HintProps> {

    render({children, text, ...props}, {errors}) {
        return (
            <div class="hint">
                {text ? localized(text) : null}
                {children}
            </div>
        )
    }
}
