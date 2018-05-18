import {cloneElement, h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import os from 'obj-str'
import {observable} from '@nx-js/observer-util'
import {LocalStorage, Store} from '../../decorators/local-storage'
import './tabs.pcss'

@LocalStorage
class Model {

    @Store((model) => `${model.id}`)
    activeTab = 0

    private id: string

    constructor(id: any) {
        this.id = id
    }

}

interface TabsProps extends JSX.HTMLAttributes {
    id: string
}

@View
export class Tabs extends QuillComponent<TabsProps> {

    model: Model

    constructor(props: TabsProps) {
        super(props)
        this.model = observable(new Model(props.id))
    }

    tabClicked(index: number) {
        this.model.activeTab = index
    }

    render({children, id, ...props}) {
        const className = props.class
        props.class = os({[className]: className, tabs: 1})
        return (
            <div {...props}>
                <ul>
                    {children.map((child, index) => cloneElement(child, {
                        click: () => this.tabClicked(index),
                        active: this.model.activeTab === index
                    }))}
                </ul>
                <div>
                    {children[this.model.activeTab].children}
                </div>
            </div>
        )
    }
}
