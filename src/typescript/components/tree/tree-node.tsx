import {QuillComponent} from '../../util/quill-component'
import {LocalStorage, Store} from '../../decorators/local-storage'
import {box, cls} from '../../util/utils'
import {observable} from '@nx-js/observer-util'
import {h} from 'preact'
import {View} from '../../decorators/view'

export enum DropPostion {
    inside = 'inside',
    above = 'above',
    below = 'below'
}

export interface NodeDrop {
    from: string
    to: string,
    position: DropPostion,
    open
}

const NODE_DATA_TYPE = 'preact-quill/node-id'

@LocalStorage
export class TreeNodeModel<T> {

    @Store((n: TreeNodeModel<T>) => `tree-${n.id()}`)
    open: boolean
    editing: boolean
    icon: string

    text: string
    value: T
    children: TreeNodeModel<T>[]

    id = () => this.text.replace(/[^a-z0-9]/ig, '-')

    constructor(text: string, value: T, children: TreeNodeModel<T>[], icon?: string) {
        this.text = text
        this.value = value
        this.children = children
        this.icon = icon
    }
}

export interface TreeNodeProps<T> {
    model: TreeNodeModel<T>
    openNodes: () => TreeNodeModel<T>[]
    editable: boolean
}

@View
export class TreeNode<T> extends QuillComponent<TreeNodeProps<T>> {

    base: HTMLLIElement

    constructor(props) {
        super(observable(props.model))
    }

    iconKey = () => {
        const {children, open, icon} = this.props.model
        if (children.length) {
            return open ? 'mdi-folder-open' : 'mdi-folder'
        }
        return icon
    }

    chevron = () => {
        const {children, open} = this.props.model
        if (children.length) {
            return open ? 'mdi-chevron-down' : 'mdi-chevron-right'
        }
        return ''
    }

    go = (ev: KeyboardEvent, direction: number) => {
        ev.preventDefault()
        const {model, openNodes} = this.props
        const nodes = openNodes()
        const index = box(
            nodes.findIndex(n => model === n) + direction,
            0, nodes.length - 1
        )
        const newNode = document.querySelector(`#${nodes[index].id()} .node`)! as HTMLDivElement
        newNode.focus()
    }

    startEditing = () => {
        const {editable, model} = this.props
        if (!editable) {
            return
        }
        model.editing = true
        requestAnimationFrame(() => this.base.querySelector('input').focus())
    }

    stopEditing = (input: HTMLInputElement, save?: boolean) => {
        const {model} = this.props
        if (save) {
            model.text = input.value
        }
        model.editing = false
        const node = this.base.firstElementChild as HTMLDivElement
        node.focus()
    }

    toggle = () => {
        const {model} = this.props
        model.open = !model.open
    }

    keyTreeInput = (ev: KeyboardEvent) => {
        const {model} = this.props
        switch (ev.key) {
            case 'ArrowLeft': model.open = false; break
            case 'ArrowRight': model.open = true; break
            case 'Enter': this.startEditing(); break
        }
    }

    keyTreeNav = (ev: KeyboardEvent) => {
        switch (ev.key) {
            case 'ArrowDown': this.go(ev, 1); break
            case 'ArrowUp': this.go(ev, -1); break
        }
    }

    keyEditInput = (ev: KeyboardEvent) => {
        ev.stopPropagation()
        switch (ev.key) {
            case 'Enter': this.stopEditing(ev.target as HTMLInputElement, true); break
            case 'Escape': this.stopEditing(ev.target as HTMLInputElement); break
        }
    }

    dblClick = () => this.startEditing()

    blur = (ev) => this.stopEditing(ev.target)

    dragstart = (ev: DragEvent) => {
        const {id} = this.props.model
        ev.stopPropagation()
        ev.dataTransfer.setData(NODE_DATA_TYPE, id())
        ev.dataTransfer.effectAllowed = 'move'
    }

    dragover = (ev: DragEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
        const relY = ev.clientY - this.base.getBoundingClientRect().top
        if (relY < 6) {
            this.base.setAttribute('data-dragover', DropPostion.above)
        } else if (relY > 18) {
            this.base.setAttribute('data-dragover', DropPostion.below)
        } else {
            this.base.setAttribute('data-dragover', DropPostion.inside)
        }
        ev.dataTransfer.dropEffect = 'move'
    }

    dragleave = (ev: DragEvent) => {
        ev.stopPropagation()
        setTimeout(() => // prevent flicker between :before <-> :after toggle
            this.base.removeAttribute('data-dragover'), 30)
    }

    drop = (ev: DragEvent) => {
        this.dragleave(ev)
        const dragId = ev.dataTransfer.getData(NODE_DATA_TYPE)
        if (dragId) {
            const {children, open, id} = this.props.model
            this.base.dispatchEvent(new CustomEvent<NodeDrop>('nodeDrop', {
                bubbles: true,
                cancelable: true,
                detail: {
                    from: dragId,
                    to: id(),
                    position: this.base.dataset['dragover'] as DropPostion,
                    open: children.length > 0 && open
                }
            }))
        }
    }

    render({model, editable, openNodes, ...props}) {
        const {open, editing, text, children, id} = model
        return (
            <li ref={(r) => this.base = r}
                id={id()}
                onDragStart={this.dragstart}
                onDragOver={this.dragover}
                onDragLeave={this.dragleave}
                onDrop={this.drop}
                draggable={true}>
                <div class={cls('node is-small', {open, editing})}
                     onKeyDown={this.keyTreeNav}
                     onKeyUp={this.keyTreeInput}
                     tabIndex={-1}>
                    <i class={`mdi ${this.chevron()} toggle`} onClick={this.toggle}/>
                    <i class={`mdi mdi-dark mdi-inactive ${this.iconKey()}`}/>
                    {editing ? (
                        <input class="tree-input input"
                               type="text"
                               value={text}
                               onKeyUp={this.keyEditInput}
                               onBlur={this.blur}/>) :
                        <span class="text" onDblClick={this.dblClick}>{text}</span>
                    }
                </div>
                <ul>
                    {children.map(model => (
                        <TreeNode model={model}
                                  editable={editable}
                                  openNodes={openNodes}/>
                    ))}
                </ul>
            </li>
        )
    }
}
