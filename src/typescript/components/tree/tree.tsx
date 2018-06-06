import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import 'shim-keyboard-event-key'
import {TreeNode, TreeNodeModel} from './tree-node'
import './tree.pcss'
import {View} from '../../decorators/view'

export interface TreeProps<T> {
    treeNodes: TreeNodeModel<T>[]
    editable: boolean
}

@View
export class Tree<T> extends QuillComponent<TreeProps<T>> {

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

