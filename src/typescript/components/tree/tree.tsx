import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {observable} from '@nx-js/observer-util'
import 'shim-keyboard-event-key'
import './tree.pcss'
import {TreeNode, TreeNodeModel} from './tree-node'

export interface TreeProps<T> {
    treeNodes: TreeNodeModel<T>[]
    editable: boolean
}

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

export class Tree<T> extends QuillComponent<TreeProps<T>> {

    constructor(props) {
        super(observable(props))
    }

    render({treeNodes, editable, ...props}) {
        const children = treeNodes.map(model => (
            <TreeNode model={model}
                      editable={editable}
                      openNodes={() => openNodes(treeNodes)}/>)
        )
        return (
            <ul class="tree">{children}</ul>
        )
    }
}

const openNodes = <T extends any>(nodes: TreeNodeModel<T>[]): TreeNodeModel<T>[] => nodes.reduce((p, c) => {
    const {open, children} = c
    return (open && children.length) ?
        [...p, c, ...openNodes(children)] :
        [...p, c]
}, [])

