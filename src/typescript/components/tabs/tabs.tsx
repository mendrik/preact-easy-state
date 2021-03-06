import {cloneElement, h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {observable} from '@nx-js/observer-util'
import {LocalStorage, Store} from '../../decorators/local-storage'
import {withClass} from '../../util/utils'
import {View} from '../../decorators/view'
import './tabs.pcss'

@LocalStorage
export class TabsModel {

    @Store((model) => `${model.id}`)
    activeTab = 0

    private id: string

    constructor(id: any) {
        this.id = id
    }

}

export interface TabsProps extends JSX.HTMLAttributes {
    id: string
    changes?: (tabIndex: number) => void
}

@View
export class Tabs extends QuillComponent<TabsProps> {

    model: TabsModel

    constructor(props: TabsProps) {
        super(props)
        this.model = observable(new TabsModel(props.id))
    }

    tabClicked = (index: number) => {
        this.model.activeTab = index
        if (this.props.changes) {
            this.props.changes(index)
        }
    }

    render({children, id, changes, ...props}) {
        return (
            <div class="tabs-container">
                <div {...withClass(props, 'tabs')}>
                    <ul>
                        {children.map((child, index) => cloneElement(child, {
                            click: () => this.tabClicked(index),
                            active: this.model.activeTab === index
                        }))}
                    </ul>
                </div>
                <div class="tab-body">
                    {children[this.model.activeTab].children}
                </div>
            </div>
        )
    }
}
