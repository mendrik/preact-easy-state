export interface FormProps<T> {
    name?: string
    error?: string
    placeHolder?: string
    value?: T
    changes: (value: T) => void
}
