import {cloneElement, Component, h, VNode} from 'preact'
import {createElement} from 'preact-compat'
import {View} from '../../decorators/view'
import './steps.pcss'
import {StepProps} from './step'
import {componentFromImport} from '../../util/utils'

export interface StepsProps extends JSX.HTMLAttributes {
    activeIndex: number
    disableNext: boolean
}

export interface StepsState extends JSX.HTMLAttributes {
    currentContent: JSX.Element
}

@View
export class Steps extends Component<StepsProps, StepsState> {

    async componentWillReceiveProps(nextProps: Readonly<StepsProps>, nextContext: any) {
        const {children, activeIndex} = this.props
        const props = (children[activeIndex] as VNode).attributes as StepProps
        const Component = componentFromImport(await props.component)
        this.setState({
            currentContent: <Component {...props}>Bla</Component>
        })
    }

    render({children, disableNext, activeIndex, ...props}, {currentContent}) {
        return (
            <div class="steps">
                <div class="step-bar">
                    {children}
                </div>
                <div class="step-content">{currentContent}</div>
            </div>
        )
    }
}
