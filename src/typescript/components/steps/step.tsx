import {Component, h} from 'preact'
import {View} from '../../decorators/view'
import './step.pcss'

export interface StepProps extends JSX.HTMLAttributes {
    component: string
    title: string
    icon: string
}

@View
export class Step extends Component<StepProps> {

    render({}) {
        return (
            <div class="step">
            </div>
        )
    }
}
