export interface FormProps<T> {
    error?: string
    placeHolder?: string
    value?: T
    changes: (value: T) => void
}
