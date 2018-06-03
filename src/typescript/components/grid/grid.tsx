import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import './grid.pcss'
import {observable} from '@nx-js/observer-util'
import {ScrollPane} from '../scroll-pane/scrollpane'
import {cls, optional} from '../../util/utils'
import {View} from '../../decorators/view'

export interface Cell {
    toString(): string
}

export interface GridProps extends JSX.HTMLAttributes {
    cells: Cell[][]
    editor?: (cell: Cell) => JSX.Element
}

export interface GridState extends JSX.HTMLAttributes {
    edit?: Cell
}

@View
export class Grid extends QuillComponent<GridProps, GridState> {

    grid: HTMLDivElement

    constructor(props) {
        super(observable(props))
    }

    editCell = (edit: Cell) => {
        this.setState({edit})
    }

    stopEditing = () => {
        this.setState({edit: undefined})
    }

    editNext = () => {

    }

    renderCell = (role: string, cell: Cell) => {
        const {editor} = this.props
        return <div {...optional('onClick', () => this.editCell(cell), !!editor)} role={role}><span>{cell.toString()}</span></div>
    }

    renderRow = (role: string, row: Cell[]) => row.map(
        cell => this.state.edit === cell ? this.props.editor(cell) : this.renderCell(role, cell)
    )

    render({children, editor, cells, ...props}) {
        props.class = cls('grid', props.class, {editable: editor})
        props.style = {
            gridTemplateColumns: cells[0].map(() => 'auto').join(' ')
        }
        return (
            <ScrollPane class="grid-wrap" style={{height: '300px', border: 'var(--border)'}} trackWidth={3}>
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
