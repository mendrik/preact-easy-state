import {cloneElement, h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {observable} from '@nx-js/observer-util'
import {LocalStorage, Store} from '../../decorators/local-storage'
import './tabs.pcss'
import {cls, withClass} from '../../util/utils'
import {View} from '../../decorators/view'

@LocalStorage
export class Model {

    @Store((model) => `${model.id}`)
    activeTab = 0

    private id: string

    constructor(id: any) {
        this.id = id
    }

}

export interface TabsProps extends JSX.HTMLAttributes {
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
        return (
            <div {...withClass(props, 'tabs')}>
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
