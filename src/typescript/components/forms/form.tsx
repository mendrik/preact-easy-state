import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import './form.pcss'
import {Context, createContext} from 'preact-context'

export interface HtmlFormProps<T> extends JSX.HTMLAttributes {
    model?: T
}

@View
export class Form<T> extends QuillComponent<HtmlFormProps<T>> {

    validationContext?: Context<T>

    constructor(props) {
        super(props)
        if (props.model) {
            this.validationContext = createContext(props.model)
        }
    }

    render({children, model, label, ...props}) {
        const Context = this.validationContext
        return model ? (
            <div class="form-group">
                <Context.Provider value={model}>
                    {children}
                </Context.Provider>
            </div>
        ) : (
            <div class="form-group">
                {children}
            </div>
        )
    }
}
