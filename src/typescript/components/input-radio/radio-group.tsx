import {h} from 'preact'
import {QuillComponent} from '../../util/quill-component'
import {View} from '../../decorators/view'
import {Context, createContext} from 'preact-context'
import {cls} from '../../util/utils'
import './radio-group.pcss'

export interface Selected<T> {
    selectedValue: T
}

export interface HtmlFormProps<T> extends JSX.HTMLAttributes, Selected<T> {
    vertical?: boolean
}

export const RadioGroupContext: Context<Selected<any>> = createContext({selectedValue: null})

@View
export class RadioGroup<T> extends QuillComponent<HtmlFormProps<T>> {

    static defaultProps = {
        vertical: false
    }

    render({children, selectedValue, vertical, ...props}) {
        return (
            <RadioGroupContext.Provider value={selectedValue}>
                <div className={cls('radio-group', {vertical})}>
                    {children}
                </div>
            </RadioGroupContext.Provider>
        )
    }
}
