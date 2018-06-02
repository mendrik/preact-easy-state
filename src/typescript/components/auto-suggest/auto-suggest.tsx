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
    renderer: (item: T) => JSX.Element
    valueRenderer: (item: T) => string
    minimumCharacters?: number
}

export interface AutoSuggestState<T> {
    value: string
    dropDownVisible: boolean
    items: T[]
    selected: T
}

@View
export class AutoSuggest<T> extends QuillComponent<AutoSuggestProps<T>, AutoSuggestState<T>> {

    static defaultProps = {
        minimumCharacters: 3,
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
            value: props.value,
            items: [],
            selected: undefined
        }
    }

    fetchItems = async (): Promise<T[]> => {
        const {items, dataSourceUrl, req} = this.props
        return items ? Promise.resolve(items) :
            fetchJson(dataSourceUrl + this.state.value, req) as Promise<T[]>
    }

    @Debounce(200)
    onInput = () => {
        this.setState({value: this.input.value})
        if (this.input.value.length >= this.props.minimumCharacters) {
            this.loadAndUpdateItems()
        } else {
            this.setState({items: []})
        }
    }

    loadAndUpdateItems = async () => {
        const items = await this.fetchItems()
        if (items.length) {
            this.setState({items, dropDownVisible: true})
        }
    }

    openDropDown = () => {
        this.setState({dropDownVisible: true})
    }

    @DocumentClick((as: AutoSuggest<T>) => as.state.dropDownVisible)
    close() {
        this.setState({dropDownVisible: false})
    }

    onKeyDown = (ev: KeyboardEvent) => {
        const {key} = ev
        if (/ArrowUp|ArrowDown/.test(key)) {
            ev.preventDefault()
        }
        switch (key) {
            case 'ArrowUp': return ''
            case 'ArrowDown': return ''
            case 'Enter': return ''
            case 'Escape': return this.close()
            default: return
        }
    }

    itemClicked = (item: T) => {
        this.props.changes(item)
        this.close()
    }

    render({children, dataSourceUrl, placeHolder, renderer, changes, valueRenderer, ...props},
           {value, dropDownVisible, items, selected}) {
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
                    onInput={this.onInput}
                    value={valueRenderer(value)}/>
                <Icon name="chevron-down" right={true} class="dropdown-trigger" onClick={this.openDropDown}/>
                {dropDownVisible ? (
                    <div class="dropdown-menu"
                         id="dropdown-menu"
                         ref={d => this.dropDown = d}
                         tabIndex={-1}
                         role="menu">
                        <div class="dropdown-content">
                            <ul>{
                                items.map(item =>
                                    cloneElement(renderer(item), {
                                        onClick: () => this.itemClicked(item),
                                        class: cls({selected: selected === item})
                                    })
                                )
                            }</ul>
                        </div>
                    </div>): null}
            </div>
        )
    }
}
