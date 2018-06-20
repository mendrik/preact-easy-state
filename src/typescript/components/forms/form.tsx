import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {validate, ValidationError} from 'class-validator'
import {Context, createContext} from 'preact-context/dist/cjs/context.js'
import {observe, unobserve} from '@nx-js/observer-util'
import './form.pcss'

export interface HtmlFormProps<T> extends JSX.HTMLAttributes {
    model: T
    validate?: boolean
    name: string
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

    static defaultProps = {
        validate: true
    }

    constructor(props) {
        super(props)
        this.state = {
            errors: []
        }
    }

    validator = async () => {
        const {model, name} = this.props
        const errors = await validate(model)
        if (errors) {
            this.setState({errors: errors.map(e => ({...e, property: name + '.' + e.property}))})
        }
        return errors
    }

    componentWillReceiveProps(nextProps: Readonly<HtmlFormProps<T>>, nextContext: any): void {
        this.setValidate(nextProps.validate)
    }

    setValidate(validate: boolean) {
        if (validate) {
            observe(this.validator)
        }
    }

    componentWillMount() {
        this.setValidate(this.props.validate)
    }

    componentWillUnmount() {
        unobserve(this.validator)
    }

    render({children, lazyValidation, validate, name, model, ...props}, {errors}) {
        return (
            <ValidationContext.Provider value={{errors}}>
                <div class="form-group">
                    {children}
                </div>
            </ValidationContext.Provider>
        )
    }
}
