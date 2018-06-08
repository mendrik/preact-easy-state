import {Component, h} from 'preact'
import {View} from '../../decorators/view'
import './steps.pcss'

export interface StepsProps extends JSX.HTMLAttributes {
    activeIndex: number
    disableNext: boolean
}

@View
export class Steps extends Component<StepsProps> {

    render({children, disableNext, activeIndex, ...props}) {
        return (
            <div class="steps">
            </div>
        )
    }
}
