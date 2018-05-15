import {Application} from './application/application'
import {render} from 'inferno'
import {createElement} from 'inferno-create-element'

document.addEventListener('DOMContentLoaded', () =>
    render(<Application/>, document.body)
)
