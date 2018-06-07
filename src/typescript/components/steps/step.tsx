import {Component, h} from 'preact'
import {View} from '../../decorators/view'
import './step.pcss'

export interface StepProps extends JSX.HTMLAttributes {
}

@View
export class Step extends Component<StepProps> {

    render({children, ...props}) {
        return (
            <div class="step">
            </div>
        )
    }
}
