import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import os from 'obj-str'
import './grid.pcss'
import {observable} from '@nx-js/observer-util'

export interface Cell {
    toString(): string
}

export interface GridProps extends JSX.HTMLAttributes {
    cells: Cell[][]
}

@View
export class Grid extends QuillComponent<GridProps> {

    constructor(props) {
        super(observable(props))
    }

    renderCell = (cell: Cell) => <div>{cell.toString()}</div>

    renderRow = (row: Cell[]) => row.map(this.renderCell)

    render({children, cells, ...props}) {
        const className = props.class
        props.class = os({[className]: className, grid: 1})
        props.style = {gridTemplateColumns: cells[0].map(c => 'auto')}
        return (
            <div {...props}>
                {cells.map(this.renderRow)}
            </div>
        )
    }
}
