export interface FormProps<T> {
    error?: string
    value?: T
    changes: (value: T) => void
}
