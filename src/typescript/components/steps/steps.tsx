import {Component, h, VNode} from 'preact'
import {createElement} from 'preact-compat'
import {View} from '../../decorators/view'
import './steps.pcss'
import {StepProps} from './step'

export interface StepsProps extends JSX.HTMLAttributes {
    activeIndex: number
    disableNext: boolean
}

export interface StepsProps extends JSX.HTMLAttributes {
    activeIndex: number
    disableNext: boolean
}

@View
export class Steps extends Component<StepsProps> {

    step: JSX.Element = null

    async componentWillReceiveProps(nextProps: Readonly<StepsProps>, nextContext: any) {
        const {children, activeIndex} = this.props
        const props = (children[activeIndex] as VNode).attributes as StepProps
        const componentPromise: Promise<any> = props.component as any
        const CurrentStep = await componentPromise
        this.step = <CurrentStep {...props}/>
        this.forceUpdate()
    }

    render({children, disableNext, activeIndex, ...props}) {
        return (
            <div class="steps">
                <div class="step-bar">
                    {children}
                </div>
                {this.step}
            </div>
        )
    }
}
