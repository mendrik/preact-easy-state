import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {HorizontalSplit} from '../../components/horizontal-split/horizontal-split'
import {ScrollPane} from '../../components/scroll-pane/scrollpane'
import {InputText} from '../../components/input-text/input-text'
import {observable} from '@nx-js/observer-util'
import {WithLabel} from '../../components/forms/with-label'
import {Tree, TreeNode} from '../../components/tree/tree'
import {Get} from '../../decorators/fetch'
import {Tabs} from '../../components/tabs/tabs'
import {Tab} from '../../components/tabs/tab'

class CustomNode extends TreeNode<string> {

    constructor(text: string, value: string, children: CustomNode[], icon?: string) {
        super(text, value, children, icon)
    }
}

class Model {
    text = 'My little demo text'
    tree: CustomNode[] = []
}

const model = observable(new Model())

const field = (field: keyof Model) => (val) => model[field] = val

@View
export class MainPage extends QuillComponent {

    @Get('/tree.json')
    fetchTree: () => Promise<any>

    async componentDidMount() {
        const tree = await this.fetchTree()
        model.tree.push(...tree.houses.map(house =>
            new CustomNode(house.name, house.wikiSuffix, house.people.map(person =>
                new CustomNode(person.name, person.wikiSuffix, (person.people || []).map(person =>
                    new CustomNode(person.name, person.wikiSuffix, [], 'mdi-account')
                ), 'mdi-account')
            ))
        ))
    }

    render() {
        return (
            <div class="application">
                <nav class="header" data-locale="navigation.title"/>
                <ScrollPane class="app-content">
                    <HorizontalSplit>
                        <div class="panel">
                            <Tree treeNodes={model.tree} editable={true}/>
                        </div>
                        <div class="panel">
                            <WithLabel name="Test input">
                                <InputText changes={field('text')} iconLeft="account" value={model.text}/>
                            </WithLabel>
                            <Tabs class="is-boxed is-small" id="demo-tabs">
                                <Tab text="Tab A" icon="car-side">
                                    Content A
                                </Tab>
                                <Tab text="Tab B" icon="car-estate">
                                    Content B
                                </Tab>
                                <Tab text="Tab C" icon="car-convertible">
                                    Content C
                                </Tab>
                            </Tabs>
                        </div>
                    </HorizontalSplit>
                </ScrollPane>
                <footer class="footer"/>
            </div>
        )
    }
}
