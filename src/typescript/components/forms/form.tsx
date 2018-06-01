import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {validate, ValidationError} from 'class-validator'
import {Context, createContext} from 'preact-context'
import './form.pcss'
import {observe} from '@nx-js/observer-util'

export interface HtmlFormProps<T> extends JSX.HTMLAttributes {
    model: T
}

export interface FormState {
    errors: ValidationError[]
}

export const ValidationContext: Context<FormState> = createContext({errors: []})

export const showErrors = (state: FormState, name: string) => {
    const error = state.errors.find(e => e.property === name)
    return error ? (
        <ul class="errors">{
            Object.values(error.constraints).map(message =>
                <li>{message}</li>
            )
        }</ul>
    ) : null
}

@View
export class Form<T> extends QuillComponent<HtmlFormProps<T>, FormState> {

    constructor(props) {
        super(props)
        this.state = {
            errors: []
        }
        observe(async () => {
            const errors = await validate(props.model)
            if (errors) {
                this.setState({errors})
            }
        })
    }

    render({children, validate, model, ...props}, {errors}) {
        return (
            <div class="form-group">
                <ValidationContext.Provider value={{errors}}>
                    {children}
                </ValidationContext.Provider>
            </div>
        )
    }
}
