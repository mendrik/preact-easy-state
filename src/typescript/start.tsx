import '../../node_modules/bulma/css/bulma.css'
import {Application} from './application/application'
import {h, render} from 'preact'

document.addEventListener('DOMContentLoaded', () => {
    render(<Application/>, document.body)
})
