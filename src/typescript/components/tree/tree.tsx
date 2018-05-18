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

    icon = (node: TreeNode<T>) => {
        if (node.children.length) {
            return node.open ? 'mdi-folder-open' : 'mdi-folder'
        }
        return node.icon
    }

    chevron = (node: TreeNode<T>) => {
        if (node.children.length) {
            return node.open ? 'mdi-chevron-down' : 'mdi-chevron-right'
        }
        return ''
    }

    go = (node: TreeNode<T>, direction: number) => {
        const openNodes = this.openNodes(this.props.treeNodes)
        const index = box(
            openNodes.findIndex(n => node === n) + direction,
            0, openNodes.length - 1
        )
        this.focus(openNodes[index])
    }

    focus = (node: TreeNode<T>) => {
        const domNode = node.base.firstElementChild as HTMLDivElement
        domNode.focus()
    }

    startEditing = (node: TreeNode<T>) => {
        if (!this.props.editable) {
            return
        }
        node.editing = true
        requestAnimationFrame(() => node.base.querySelector('input').focus())
    }

    stopEditing = (node: TreeNode<T>, input: HTMLInputElement, save?: boolean) => {
        if (save) {
            node.text = input.value
        }
        node.editing = false
        this.focus(node)
    }

    toggle = (node: TreeNode<T>) => () => {
        node.open = !node.open
    }

    keyTreeInput = (node: TreeNode<T>) => (ev: KeyboardEvent) => {
        switch (ev.key) {
            case 'ArrowLeft': node.open = false; break
            case 'ArrowRight': node.open = true; break
            case 'ArrowDown': this.go(node, 1); break
            case 'ArrowUp': this.go(node, -1); break
            case 'Enter': this.startEditing(node); break
        }
    }

    keyEditInput = (node: TreeNode<T>) => (ev: KeyboardEvent) => {
        ev.stopPropagation()
        switch (ev.key) {
            case 'Enter': this.stopEditing(node, ev.target as HTMLInputElement, true); break
            case 'Escape': this.stopEditing(node, ev.target as HTMLInputElement); break
        }
    }

    dblClick = (node: TreeNode<T>) => () => this.startEditing(node)
    blur = (node: TreeNode<T>) => (ev) => this.stopEditing(node, ev.target)

    renderNode = (node: TreeNode<T>) => (
        <li ref={(r) => node.base = r}>
            <div class={os({node, open: node.open, editing: node.editing, 'is-small': 1})}
                 onKeyUp={this.keyTreeInput(node)}
                 tabIndex={-1}>
                <i class={`mdi ${this.chevron(node)} toggle`}
                   onClick={this.toggle(node)}/>
                <i class={`mdi mdi-dark mdi-inactive ${this.icon(node)}`}/>
                {node.editing ? (
                        <input class="tree-input"
                               type="text"
                               value={node.text}
                               onKeyUp={this.keyEditInput(node)}
                               onBlur={this.blur(node)}/>) :
                    <span class="text" onDblClick={this.dblClick(node)}>{node.text}</span>
                }
            </div>
            <ul>
                {node.children.map(n => this.renderNode(n))}
            </ul>
        </li>
    )

    render({...props}) {
        const className = props.class
        props.class = os({[className]: className, tree: 1})
        return (
            <ul {...props}>
                {this.props.treeNodes.map(n => this.renderNode(n))}
            </ul>
        )
    }

    openNodes = (nodes: TreeNode<T>[]): TreeNode<T>[] => nodes.reduce((p, c) => {
        return (c.open && c.children.length) ?
            [...p, c, ...this.openNodes(c.children)] :
            [...p, c]
    }, [])
}
