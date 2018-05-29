import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {findParent, intersectDiff, withClass} from '../../util/utils'
import './in-view.pcss'

export interface InViewProps extends JSX.HTMLAttributes {
    gap?: number
}

export interface Overlap {
    diffX: number
    diffY: number
}

@View
export class InView extends QuillComponent<InViewProps> {

    static defaultProps = {
        gap: 15
    }

    componentDidMount() {
        this.calculatePosition()
    }

    componentWillUnmount() {
        this.base.style.setProperty('--offset-x', `0px`)
        this.base.style.setProperty('--offset-y', `0px`)
    }

    calculatePosition = () => {
        const scroll = findParent(this.base, (el: HTMLElement) =>
            /scroll|auto/i.test(getComputedStyle(el).getPropertyValue('overflow-y'))
        )
        if (scroll) {
            const overlap = intersectDiff(
                scroll.parentElement.getBoundingClientRect(),
                this.base.getBoundingClientRect()
            )
            let {diffX, diffY} = overlap
            diffX += Math.sign(diffX) * this.props.gap
            diffY += Math.sign(diffY) * this.props.gap
            this.base.style.setProperty('--offset-x', `${-diffX}px`)
            this.base.style.setProperty('--offset-y', `${-diffY}px`)
        }
    }

    render({children, observableFn, ...props}) {
        return (
            <div {...withClass(props, 'in-view')}>
                {children}
            </div>
        )
    }
}
