import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {HorizontalSplit} from '../../components/horizontal-split/horizontal-split'
import {ScrollPane} from '../../components/scroll-pane/scrollpane'
import {InputText} from '../../components/input-text/input-text'
import {observable} from '@nx-js/observer-util'
import {WithLabel} from '../../components/forms/with-label'
import {NodeDrop, Tree} from '../../components/tree/tree'
import {Get} from '../../decorators/fetch'
import {Tabs} from '../../components/tabs/tabs'
import {Tab} from '../../components/tabs/tab'
import {Cell, Grid} from '../../components/grid/grid'
import {TreeNodeModel} from '../../components/tree/tree-node'
import {CustomEvent} from '../../decorators/custom-event'
import {DatePicker} from '../../components/date-picker/date-picker'
import {Tooltip, WithTooltip} from '../../components/tooltip/tooltip'
import {View} from '../../decorators/view'

class CustomNode extends TreeNodeModel<string> {

}

class CustomCell implements Cell {
    text: string

    constructor(text: string) {
        this.text = text
    }

    toString = () => this.text
}

class Model {
    text = 'My little demo text'
    date = new Date()
    datetime = new Date()
    tree: CustomNode[] = []
    data: Cell[][] = [[]]
}

const model = observable(new Model())

const field = (field: keyof Model) => (val) => model[field] = val

const customTreeModel = (name: string, value: string, people: any[], icon?: string) =>
    new TreeNodeModel<string>(name, value, (people || []).map(person =>
        customTreeModel(person.name, person.wikiSuffix, person.people, 'mdi-account')
    ), icon)

const toTreeNodes = (tree) => tree.houses.map(house =>
    customTreeModel(house.name, house.wikiSuffix, house.people)
)

@View
export class MainPage extends QuillComponent {

    @Get('/tree.json')
    fetchTree: () => Promise<any>

    @Get('/data.csv', {processor: (res: Response) => res.text()})
    fetchData: () => Promise<any>

    async componentDidMount() {
        const [tree, data] = await Promise.all([this.fetchTree(), this.fetchData()])
        model.tree.push(...toTreeNodes(tree))
        model.data = data.split(/\n\s*/g).filter(l => !!l).map(line => {
            return line.split(/\s*,\s*/).map(value =>
                new CustomCell(value.replace(/"?(.*?)"?/gi, '$1'))
            )
        })
    }

    @CustomEvent('nodeDrop')
    nodeDrop = (drop: NodeDrop) => console.log(drop)

    render() {
        const tooltip = <Tooltip>My little tooltip<br/>goes here!</Tooltip>
        return (
            <div class="application">
                <nav class="header" data-locale="navigation.title"/>
                <ScrollPane class="app-content" trackWidth={6}>
                    <HorizontalSplit>
                        <div class="panel">
                            <Tree treeNodes={model.tree} editable={true}/>
                        </div>
                        <div class="panel page">
                            <WithLabel name="Test input">
                                <InputText changes={field('text')} iconLeft="account" value={model.text}/>
                            </WithLabel>
{/*
                            <WithLabel name="Test date input">
                                <DatePicker withTime={false}
                                            changes={field('date')}
                                            format="dd.MM.yyyy"
                                            value={model.date}/>
                            </WithLabel>
*/}
                            <WithLabel name="Test date time input">
                                <DatePicker withTime={true}
                                            changes={field('datetime')}
                                            format="dd.MM.yyyy HH:mm"
                                            value={model.datetime}/>
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
                            <Grid cells={model.data} editable={true}/>
                            <div class="buttons">
                                <WithTooltip tooltip={tooltip}>
                                    <a class="button is-primary">Primary</a>
                                </WithTooltip>
                                <a class="button is-link">Link</a>
                                <a class="button is-info">Info</a>
                            </div>
                        </div>
                    </HorizontalSplit>
                </ScrollPane>
                <footer class="footer"/>
            </div>
        )
    }
}
