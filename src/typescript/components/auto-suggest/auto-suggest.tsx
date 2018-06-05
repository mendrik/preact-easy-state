import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'
import {DocumentClick} from '../../decorators/document-click'
import {ExtendedRequest, fetchJson} from '../../decorators/fetch'
import {Debounce} from '../../decorators/debounce'
import {Key, onKey} from '../../decorators/on-key'
import './auto-suggest.pcss'

export interface AutoSuggestProps<T> extends FormProps<T> {
    dataSourceUrl?: string
    items?: T[]
    req?: ExtendedRequest
    maxItems?: number
    renderer: (item: T) => JSX.Element
    valueRenderer: (item: T) => string
    minimumCharacters?: number
}

export interface AutoSuggestState<T> {
    dropDownVisible: boolean
    items: T[]
    selected: T
    loading?: boolean
}

@View
export class AutoSuggest<T> extends QuillComponent<AutoSuggestProps<T>, AutoSuggestState<T>> {

    static defaultProps = {
        minimumCharacters: 3,
        maxItems: 10,
        req: {
            headers: {
                'Accept': 'application/json'
            }
        }
    }

    input: HTMLInputElement
    dropDown: HTMLDivElement

    constructor(props) {
        super(props)
        this.state = {
            dropDownVisible: false,
            items: [],
            selected: undefined,
            loading: false
        }
    }

    componentWillReceiveProps(nextProps: Readonly<AutoSuggestProps<T>>, nextContext: any): void {
        this.input.value = nextProps.valueRenderer(nextProps.value)
    }

    fetchItems = async (): Promise<T[]> => {
        const {items, dataSourceUrl, req} = this.props
        return items ? Promise.resolve(items) :
            fetchJson(dataSourceUrl + this.input.value, req) as Promise<T[]>
    }

    @Debounce(200)
    onInput = () => {
        if (this.input.value.length >= this.props.minimumCharacters) {
            this.loadAndUpdateItems()
        } else {
            this.setState({items: [], dropDownVisible: false})
        }
    }

    loadAndUpdateItems = async () => {
        this.setState({loading: true})
        try {
            const items = await this.fetchItems()
            this.setState({
                items: items.slice(0, this.props.maxItems),
                dropDownVisible: true,
                selected: items[0],
                loading: false
            })
        } catch (e) {
            this.setState({items: [], loading: false})
        }
    }

    @DocumentClick((as: AutoSuggest<T>) => as.state.dropDownVisible)
    close() {
        this.setState({dropDownVisible: false, selected: undefined, loading: false})
    }

    @Key('ArrowUp')
    @Key('ArrowDown')
    nextItem = (key: string) => {
        const {items, selected} = this.state
        const index = (items.findIndex(i => i === selected) + (/ArrowUp/i.test(key) ? -1 : 1) + items.length) % items.length
        this.setState({selected: items[index]})
    }

    @Key('Enter')
    confirmSelected = () => {
        if (this.state.dropDownVisible) {
            this.props.changes(this.state.selected)
            this.close()
        }
    }

    @Key('Escape')
    onBlur = () => {
        const {input, props: {valueRenderer, value}} = this
        if (/^\s*$/.test(input.value)) {
            this.props.changes(undefined)
        }
        else if (value) {
            input.value = valueRenderer(value)
        }
        input.blur()
        this.close()
    }

    itemClicked = (ev: MouseEvent, item: T) => {
        this.props.changes(item)
        this.onBlur()
    }

    render({children, dataSourceUrl, placeHolder, renderer, changes, valueRenderer, ...props},
           {value, dropDownVisible, items, selected, loading}) {
        return (
            <div class={cls('control has-icons-right auto-suggest dropdown', {
                'is-active': dropDownVisible
            })}>
                <input
                    ref={r => this.input = r}
                    type="text"
                    class="input is-small"
                    name={name}
                    placeholder={placeHolder}
                    onKeyDown={onKey(this)}
                    onBlur={this.onBlur}
                    onFocus={this.onInput}
                    onInput={this.onInput}/>
                {loading ?
                    <Icon name="loading" spin={true} right={true} class="dropdown-trigger"/>:
                    <Icon name="magnify" right={true} class="dropdown-trigger"/>
                }
                {dropDownVisible ? (
                    <div class="dropdown-menu"
                         id="dropdown-menu"
                         ref={d => this.dropDown = d}
                         role="menu">
                        <div class="dropdown-content">
                            <ul>{
                                items.map(item =>
                                    <li class={cls({selected: selected === item})}
                                        onMouseDown={e => this.itemClicked(e, item)}>
                                        {renderer(item)}
                                    </li>
                                )
                            }</ul>
                        </div>
                    </div>): null}
            </div>
        )
    }
}
