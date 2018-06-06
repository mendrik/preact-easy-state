import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {HorizontalSplit} from '../../components/horizontal-split/horizontal-split'
import {ScrollPane} from '../../components/scroll-pane/scrollpane'
import {InputText} from '../../components/input-text/input-text'
import {Tree} from '../../components/tree/tree'
import {Get} from '../../decorators/fetch'
import {Tabs} from '../../components/tabs/tabs'
import {Tab} from '../../components/tabs/tab'
import {Cell, Grid} from '../../components/grid/grid'
import {NodeDrop, TreeNodeModel} from '../../components/tree/tree-node'
import {CustomEvent} from '../../decorators/custom-event'
import {DatePicker} from '../../components/date-picker/date-picker'
import {Tooltip, WithTooltip} from '../../components/tooltip/tooltip'
import {View} from '../../decorators/view'
import {DropDown, DropDownDivider, DropDownItem} from '../../components/drop-down/drop-down'
import {InputNumber} from '../../components/input-number/input-number'
import {InputSwitch} from '../../components/input-switch/input-switch'
import {Data, model, RadioValue} from '../../model/application'
import {CustomCell} from '../../model/custom-cell'
import {FieldGroup} from '../../components/forms/field-group'
import {Form} from '../../components/forms/form'
import {Modal} from '../../components/modal/modal'
import {ProgressBar} from '../../components/progress-bar/progress-bar'
import {AutoSuggest} from '../../components/auto-suggest/auto-suggest'
import {InputCheckbox} from '../../components/input-checkbox/input-checkbox'
import {InputRadio} from '../../components/input-radio/input-radio'
import {RadioGroup} from '../../components/input-radio/radio-group'
import {Toasts} from '../../components/toast/toasts'
import {Toast, ToastTheme} from '../../components/toast/toast'
import {InputSlider} from '../../components/input-slider/input-slider'

const field = (field: keyof Data) => (val) => model[field] = val

const customTreeModel = (name: string, value: string, people: any[], icon?: string) =>
    new TreeNodeModel<string>(name, value, (people || []).map(person =>
        customTreeModel(person.name, person.wikiSuffix, person.people, 'mdi-account')
    ), icon)

const toTreeNodes = (tree) => tree.houses.map(house =>
    customTreeModel(house.name, house.wikiSuffix, house.people)
)

function toCellData(data: any) {
    return data.split(/\n\s*/g).filter(l => !!l).map(line => {
        return line.split(/\s*,\s*/).map(value =>
            new CustomCell(value.replace(/"?(.*?)"?/gi, '$1'))
        )
    })
}

export interface IPage {
}

@View
export class MainPage extends QuillComponent implements IPage {

    private grid: Grid
    private toasts: Toasts

    @Get('tree.json')
    fetchTree: () => Promise<any>

    @Get('data.csv', {processor: (res: Response) => res.text()})
    fetchData: () => Promise<any>

    async componentDidMount() {
        const [tree, data] = await Promise.all([this.fetchTree(), this.fetchData()])
        model.tree.push(...toTreeNodes(tree))
        model.data = toCellData(data)
    }

    @CustomEvent('nodeDrop')
    nodeDrop = (drop: NodeDrop) => console.log(drop)

    stopCellEditing = () => {
        this.grid.stopEditing()
    }

    cellEditor = (cell: Cell) => <input
        type="text"
        value={cell.toString()}
        class="input is-small"
        onBlur={this.stopCellEditing}
        onChange={this.stopCellEditing}/> // use proper cell editor

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
                            {this.testForm()}
                            <Tabs class="is-boxed is-small" id="demo-tabs">
                                <Tab text="Tab A" icon="car-side">
                                    <Grid cells={model.data}
                                          editor={this.cellEditor}
                                          ref={g => this.grid = g}/>
                                </Tab>
                                <Tab text="Tab B" icon="car-estate">
                                    Content B
                                </Tab>
                                <Tab text="Tab C" icon="car-convertible">
                                    Content C
                                </Tab>
                            </Tabs>
                            <div class="buttons">
                                <WithTooltip tooltip={tooltip}>
                                    <a class="button is-primary">Primary</a>
                                </WithTooltip>
                                <a className="button is-link" onClick={() => model.modal = true}>Modal</a>
                                {this.modal()}
                                <a class="button is-info" onClick={this.showProgress}>Progress</a>
                                {this.progress()}
                                <a className="button is-info" onClick={this.showToast}>Toast</a>
                            </div>
                        </div>
                    </HorizontalSplit>
                </ScrollPane>
                <footer class="footer"/>
                <Toasts ref={t => this.toasts = t}/>
            </div>
        )
    }

    showToast = () => {
        const theme = ToastTheme.WARNING
        this.toasts.showToast(<Toast title="toast.title"
                                     message="toast.message"
                                     theme={theme}>Hello</Toast>)
    }

    showProgress = () => {
        model.progress = true
        setTimeout(() => model.progress = false, 2000)
    }

    progress = () => model.progress ? <ProgressBar/> : null

    modal = () => model.modal ? (
        <Modal onClose={() => model.modal = false}>
            <div class="buttons is-right">
                <a className="button is-primary">Ok</a>
            </div>
        </Modal>
    ) : null

    renderer = (item: any) => <span>{item.name}</span>

    testForm = () => (
        <Form model={model}>
            <FieldGroup label="Search">
                <AutoSuggest changes={(v) => model.autoSuggest = v}
                             dataSourceUrl="https://restcountries.eu/rest/v2/name/"
                             valueRenderer={(item: any) => item ? item.name : ''}
                             value={model.autoSuggest}
                             renderer={this.renderer}/>
            </FieldGroup>
            <FieldGroup label="Test">
                <InputSwitch changes={(b) => model.bool = b}
                             value={model.bool}/>
                <InputNumber changes={(value) => model.integer = value}
                             name="integer"
                             value={model.integer}/>
                <InputNumber changes={(number) => console.log(number)}
                             value={model.float}
                             prefix="€ "
                             suffix=" / kpl"
                             integer={false}/>
            </FieldGroup>
            <FieldGroup label="Dropdown test">
                <DropDown text="Dropdown button">
                    <DropDownItem onClick={() => 0}>Bla</DropDownItem>
                    <DropDownItem onClick={() => 0}>Blub</DropDownItem>
                    <DropDownDivider/>
                    <DropDownItem onClick={() => 0}>Test</DropDownItem>
                </DropDown>
                <InputText iconLeft="account"
                           name="text"
                           placeHolder="Normal text"
                           changes={(value) => model.text = value}
                           value={model.text}/>
                <DatePicker changes={field('date')}
                            format="dd.MM.yyyy"
                            value={model.date}/>
            </FieldGroup>
            <FieldGroup label="Test time">
                <DatePicker withTime={true}
                            withMonths={true}
                            changes={field('datetime')}
                            format="dd.MM.yyyy HH:mm"
                            value={model.datetime}/>
                <InputCheckbox name="bool"
                               value={model.bool}
                               changes={(v) => model.bool = v}>Checkbox</InputCheckbox>
            </FieldGroup>
            <FieldGroup label="Test radios">
                <RadioGroup selectedValue={model.radio}>
                    <InputRadio name="bool"
                                changes={r => model.radio = r}
                                value={RadioValue.VALUE1}>Value1</InputRadio>
                    <InputRadio name="bool"
                                changes={r => model.radio = r}
                                value={RadioValue.VALUE2}>Value2</InputRadio>
                    <InputRadio name="bool"
                                changes={r => model.radio = r}
                                value={RadioValue.VALUE3}>Value3</InputRadio>
                </RadioGroup>
            </FieldGroup>
            <FieldGroup label="Test slider">
                <InputSlider min={0}
                             max={100}
                             steps={10}
                             value={model.slider}
                             changes={(v) => model.slider = v}/>
            </FieldGroup>
        </Form>
    )
}
