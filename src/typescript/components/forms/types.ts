export interface FormProps<T> {
    name?: string
    placeHolder?: string
    value?: T
    changes: (value: T) => void
    disabled?: boolean
}
