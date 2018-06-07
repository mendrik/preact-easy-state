import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {validate, ValidationError} from 'class-validator'
import {Context, createContext} from 'preact-context'
import {observe, unobserve} from '@nx-js/observer-util'
import './form.pcss'
import {Key, onKey, onKeySpy} from '../../decorators/on-key'

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

    lastActive: HTMLInputElement

    constructor(props) {
        super(props)
        this.state = {
            errors: []
        }
    }

    validator = async () => {
        const errors = await validate(this.props.model)
        if (errors) {
            this.setState({errors})
        }
        return errors
    }

    componentWillMount() {
        observe(this.validator)
    }

    componentWillUnmount() {
        unobserve(this.validator)
    }

    render({children, validate, model, ...props}, {errors}) {
        return (
            <ValidationContext.Provider value={{errors}}>
                <div class="form-group">
                    {children}
                </div>
            </ValidationContext.Provider>
        )
    }
}
