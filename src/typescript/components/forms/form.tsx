import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {ValidationError} from 'class-validator'
import {Context, createContext} from 'preact-context'
import './form.pcss'

export interface HtmlFormProps<T> extends JSX.HTMLAttributes {
    validate: boolean
    model: T
}

export interface FormState {
    errors: ValidationError[]
}

export const ValidationContext: Context<FormState> = createContext({errors: []})

export const showErrors = (validationState: FormState, name: string) => {
    const error = validationState.errors.find(e => e.property === name)
    return error ? (
        <ul>{Object.values(error.constraints).map(message =>
            <li>{message}</li>
        )}</ul>) : null
}

@View
export class Form<T> extends QuillComponent<HtmlFormProps<T>, FormState> {

    constructor(props) {
        super(props)
    }

    render({children, validate, model, ...props}, {errors}) {
        return (
            <div class="form-group">
                <ValidationContext.Provider value={errors}>
                    {children}
                </ValidationContext.Provider>
            </div>
        )
    }
}
