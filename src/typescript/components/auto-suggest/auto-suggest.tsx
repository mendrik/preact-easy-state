import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {FormProps} from '../forms/types'
import {observable} from '@nx-js/observer-util'
import {cls} from '../../util/utils'
import {View} from '../../decorators/view'
import {Icon} from '../icon/icon'
import './auto-suggest.pcss'
import {DocumentClick} from '../../decorators/document-click'
import {fetchJson, ExtendedRequest} from '../../decorators/fetch'

export interface AutoSuggestProps<T> extends FormProps<T> {
    dataSourceUrl?: string
    items?: T[]
    req?: ExtendedRequest
    renderer: (item: T) => JSX.Element
    minimumCharacters?: number
}

export interface AutoSuggestState<T> {
    value: string
    dropDownVisible: boolean
    items: T[]
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

    constructor(props) {
        super(props)
        this.state = {
            dropDownVisible: false,
            value: props.value,
            items: []
        }
    }

    fetchItems = async (): Promise<T[]> => {
        const {items, dataSourceUrl, req} = this.props
        return items ? Promise.resolve(items) :
            fetchJson(dataSourceUrl + this.state.value, req) as Promise<T[]>
    }

    onInput = (ev) => {
        this.setState({value: this.input.value})
        if (this.input.value.length >= this.props.minimumCharacters) {
            this.loadAndUpdateItems()
        } else {
            this.setState({items: []})
        }
    }

    loadAndUpdateItems = async () => {
        const items = await this.fetchItems()
        console.log(items)
        if (items.length) {
            this.setState({items})
        }
    }

    openDropDown = (ev: Event) => {
        this.setState({dropDownVisible: true})
    }

    @DocumentClick((as: AutoSuggest<T>) => as.state.dropDownVisible)
    close() {
        this.setState({dropDownVisible: false})
    }

    render({children, dataSourceUrl, placeHolder, renderer, changes, ...props},
           {value, dropDownVisible, items}) {
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
                    onInput={this.onInput}
                    value={value}/>
                <Icon name="chevron-down" right={true} class="dropdown-trigger" onClick={this.openDropDown}/>
                {dropDownVisible ? (
                    <div class="dropdown-menu"
                         id="dropdown-menu"
                         tabIndex={-1}
                         role="menu">
                        <div class="dropdown-content">
                            {items ? <ul>{items.map(renderer)}</ul> : <span class="loading">Loading...</span>}
                        </div>
                    </div>): null}
            </div>
        )
    }
}
