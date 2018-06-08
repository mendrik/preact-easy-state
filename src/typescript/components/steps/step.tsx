import {Component, h} from 'preact'
import {View} from '../../decorators/view'
import './step.pcss'
import {Icon} from '../icon/icon'

export interface StepProps {
    component?: Promise<any>
    title: string
    icon?: string
}

@View
export class Step extends Component<StepProps> {

    render({children, title, icon, component, ...props}) {
        return (
            <div class="step">
                <div class="step-title">
                    {icon ? <Icon big={true} name={icon}/> : null}
                    <span>{title}</span>
                </div>
                {children}
            </div>
        )
    }
}
