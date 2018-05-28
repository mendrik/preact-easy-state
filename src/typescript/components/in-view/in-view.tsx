import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {observe} from '@nx-js/observer-util'
import {findParent, intersect} from '../../util/utils'

export interface InViewProps extends JSX.HTMLAttributes {
    observableFn: () => void
}

@View
export class InView extends QuillComponent<InViewProps> {

    componentDidMount(): void {
        this.calculatePosition()
    }

    calculatePosition = () => {
        const scroll = findParent(this.base, (el: HTMLElement) =>
            /scroll|auto/i.test(getComputedStyle(el).getPropertyValue('overflow-y'))
        )
        const r = intersect(this.base.getBoundingClientRect(), scroll.getBoundingClientRect())
        console.log(r)
    }

    render({children, observableFn, ...props}) {
        return (
            <div {...props}>
                {children}
            </div>
        )
    }
}
