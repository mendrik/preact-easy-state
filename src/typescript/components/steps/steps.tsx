import {Component, h} from 'preact'
import {View} from '../../decorators/view'
import './steps.pcss'

export interface StepsProps extends JSX.HTMLAttributes {
}

@View
export class Steps extends Component<StepsProps> {

    render({children, steps, ...props}) {
        return (
            <div class="steps">
            </div>
        )
    }
}
