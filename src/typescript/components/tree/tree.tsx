import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {observable} from '@nx-js/observer-util'
import {LocalStorage, Store} from '../../decorators/local-storage'
import os from 'obj-str'
import 'shim-keyboard-event-key'
import './tree.pcss'
import {box} from '../../util/utils'

export interface TreeProps<T> extends JSX.HTMLAttributes {
    treeNodes: TreeNode<T>[]
    editable: boolean
}

const NODE_DATA_TYPE = 'preact-quill/node-id'

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

@LocalStorage
export class TreeNode<T> {

    base: HTMLLIElement

    @Store((n: TreeNode<T>) => `tree-${n.id()}`)
    open: boolean

    editing: boolean
    children: TreeNode<T>[]
    value: T
    text: string
    icon: string

    id = () => this.text.replace(/[^a-z0-9]/ig, '-')

    constructor(text: string, value: T, children: TreeNode<T>[], icon?: string) {
        this.text = text
        this.value = value
        this.children = children
        this.icon = icon
    }
}

@View
export class Tree<T> extends QuillComponent<TreeProps<T>> {

    constructor(props) {
        super(observable(props))
    }

    onDrop = (drop: NodeDrop) => {
        console.log(drop)
    }

    render({treeNodes, editable, ...props}) {
        const className = props.class
        props.class = os({[className]: className, tree: 1})
        return (
            <ul {...props}>
                {treeNodes.map(n => renderNode(n, treeNodes, this.onDrop, editable))}
            </ul>
        )
    }
}

const openNodes = <T extends any>(nodes: TreeNode<T>[]): TreeNode<T>[] => nodes.reduce((p, c) => {
    return (c.open && c.children.length) ?
        [...p, c, ...openNodes(c.children)] :
        [...p, c]
}, [])

const renderNode = <T extends any>(node: TreeNode<T>,
                                   treeNodes: TreeNode<T>[],
                                   onDrop: (ev: NodeDrop) => void,
                                   editable: boolean) => {

    const icon = () => {
        if (node.children.length) {
            return node.open ? 'mdi-folder-open' : 'mdi-folder'
        }
        return node.icon
    }

    const chevron = () => {
        if (node.children.length) {
            return node.open ? 'mdi-chevron-down' : 'mdi-chevron-right'
        }
        return ''
    }

    const go = (direction: number) => {
        const nodes = openNodes(treeNodes)
        const index = box(
            nodes.findIndex(n => node === n) + direction,
            0, nodes.length - 1
        )
        focus(nodes[index])
    }

    const focus = (node: TreeNode<T>) => {
        const domNode = node.base.firstElementChild as HTMLDivElement
        domNode.focus()
    }

    const startEditing = () => {
        if (!editable) {
            return
        }
        node.editing = true
        requestAnimationFrame(() => node.base.querySelector('input').focus())
    }

    const stopEditing = (input: HTMLInputElement, save?: boolean) => {
        if (save) {
            node.text = input.value
        }
        node.editing = false
        focus(node)
    }

    const toggle = () => {
        node.open = !node.open
    }

    const keyTreeInput = (ev: KeyboardEvent) => {
        switch (ev.key) {
            case 'ArrowLeft': node.open = false; break
            case 'ArrowRight': node.open = true; break
            case 'ArrowDown': go(1); break
            case 'ArrowUp': go(-1); break
            case 'Enter': startEditing(); break
        }
    }

    const keyEditInput = (ev: KeyboardEvent) => {
        ev.stopPropagation()
        switch (ev.key) {
            case 'Enter': stopEditing(ev.target as HTMLInputElement, true); break
            case 'Escape': stopEditing(ev.target as HTMLInputElement); break
        }
    }

    const dblClick = () => startEditing()

    const blur = (ev) => stopEditing(ev.target)

    const dragstart = (ev: DragEvent) => {
        ev.stopPropagation()
        ev.dataTransfer.setData(NODE_DATA_TYPE, node.id())
        ev.dataTransfer.effectAllowed = 'move'
    }

    const dragover = (ev: DragEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
        const relY = ev.clientY - node.base.getBoundingClientRect().top
        if (relY < 6) {
            node.base.setAttribute('data-dragover', DropPostion.above)
        } else if (relY > 18) {
            node.base.setAttribute('data-dragover', DropPostion.below)
        } else {
            node.base.setAttribute('data-dragover', DropPostion.inside)
        }
        ev.dataTransfer.dropEffect = 'move'
    }

    const dragleave = (ev: DragEvent) => {
        ev.stopPropagation()
        setTimeout(() => // prevent flicker between :before <-> :after toggle
            node.base.removeAttribute('data-dragover'), 30)
    }

    const drop = (ev: DragEvent) => {
        dragleave(ev)
        const id = ev.dataTransfer.getData(NODE_DATA_TYPE)
        if (id) {
            onDrop({
                from: id,
                to: node.id(),
                position: node.base.dataset['dragover'] as DropPostion,
                open: node.children.length > 0 && node.open
            })
        }
    }

    return (
        <li ref={(r) => node.base = r}
            onDragStart={dragstart}
            onDragOver={dragover}
            onDragLeave={dragleave}
            onDrop={drop}
            draggable={true}>
            <div class={os({node, open: node.open, editing: node.editing, 'is-small': 1})}
                 onKeyUp={keyTreeInput}
                 tabIndex={-1}>
                <i class={`mdi ${chevron()} toggle`}
                   onClick={toggle}/>
                <i class={`mdi mdi-dark mdi-inactive ${icon()}`}/>
                {node.editing ? (
                        <input class="tree-input"
                               type="text"
                               value={node.text}
                               onKeyUp={keyEditInput}
                               onBlur={blur}/>) :
                    <span class="text" onDblClick={dblClick}>{node.text}</span>
                }
            </div>
            <ul>
                {node.children.map(n => renderNode(n, treeNodes, onDrop, editable))}
            </ul>
        </li>
    )
}
