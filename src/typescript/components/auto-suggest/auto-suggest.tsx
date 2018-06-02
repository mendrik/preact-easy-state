import {cloneElement, h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'
import {DocumentClick} from '../../decorators/document-click'
import {ExtendedRequest, fetchJson} from '../../decorators/fetch'
import {Debounce} from '../../decorators/debounce'
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
        const items = await this.fetchItems()
        if (items && items.length) {
            this.setState({
                items: items.slice(0, this.props.maxItems),
                dropDownVisible: true,
                selected: items[0],
                loading: false
            })
        } else {
            this.setState({loading: false})
        }
    }

    openDropDown = () => {
        this.setState({dropDownVisible: true})
    }

    @DocumentClick((as: AutoSuggest<T>) => as.state.dropDownVisible)
    close() {
        this.setState({dropDownVisible: false})
    }

    nextItem = (dir: number) => {
        const {items, selected} = this.state
        const index = (items.findIndex(i => i === selected) + dir + items.length) % items.length
        this.setState({selected: items[index]})
    }

    confirmSelected = () => {
        this.props.changes(this.state.selected)
        this.close()
    }

    onKeyDown = (ev: KeyboardEvent) => {
        const {key} = ev
        if (/ArrowUp|ArrowDown/.test(key)) {
            ev.preventDefault()
        }
        switch (key) {
            case 'ArrowUp': return this.nextItem(-1)
            case 'ArrowDown': return this.nextItem(1)
            case 'Enter': return this.confirmSelected()
            case 'Escape': return this.onBlur()
            default: return
        }
    }

    onBlur = () => {
        const {valueRenderer, value} = this.props
        if (value) {
            this.input.value = valueRenderer(value)
        }
        this.setState({loading: false})
        this.close()
    }

    itemClicked = (ev: MouseEvent, item: T) => {
        console.log(item)
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
                    onKeyDown={this.onKeyDown}
                    onBlur={this.onBlur}
                    onFocus={this.onInput}
                    onInput={this.onInput}/>
                {loading ?
                    <Icon name="loading" spin={true} right={true} class="dropdown-trigger"/>:
                    <Icon name="chevron-down" right={true} class="dropdown-trigger"/>
                }
                {dropDownVisible ? (
                    <div class="dropdown-menu"
                         id="dropdown-menu"
                         ref={d => this.dropDown = d}
                         tabIndex={-1}
                         role="menu">
                        <div class="dropdown-content">
                            <ul>{
                                items.map(item =>
                                    <li class={cls({selected: selected === item})}
                                        onClick={e => this.itemClicked(e, item)}>
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
