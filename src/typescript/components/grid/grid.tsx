import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import os from 'obj-str'
import './grid.pcss'
import {observable} from '@nx-js/observer-util'
import {ScrollPane} from '../scroll-pane/scrollpane'

export interface Cell {
    toString(): string
}

export interface GridProps extends JSX.HTMLAttributes {
    cells: Cell[][]
    editable: boolean
}

@View
export class Grid extends QuillComponent<GridProps> {

    grid: HTMLDivElement

    constructor(props) {
        super(observable(props))
    }

    renderCell = (role: string, cell: Cell) =>
        <div role={role}>{cell.toString()}</div>

    renderRow = (role: string, row: Cell[]) => row.map(
        cell => this.renderCell(role, cell)
    )

    render({children, editable, cells, ...props}) {
        const className = props.class
        props.class = os({[className]: className, grid: 1, editable})
        props.style = {gridTemplateColumns: cells[0].map(c => 'auto').join(' ')}
        return (
            <ScrollPane style={{height: '300px', border: 'var(--border)'}}>
                <div {...props} ref={(g) => this.grid = g}>
                    {cells.map((c, idx) => this.renderRow(this.getRowRole(idx), c))}
                </div>
            </ScrollPane>
        )
    }

    getRowRole = (idx) => {
        return idx === 0 ? 'header' : (idx % 2 !== 0 ? 'cell' : 'cell-even')
    }
}
