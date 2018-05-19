import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import os from 'obj-str'
import './grid.pcss'


export interface Cell {
    toString(): string
}

export interface GridProps extends JSX.HTMLAttributes {
    cells: Cell[][]
}

@View
export class Grid extends QuillComponent<GridProps> {

    render({children, cells, ...props}) {
        const className = props.class
        props.class = os({[className]: className, grid: 1})
        return (
            <div {...props}>
            </div>
        )
    }
}
