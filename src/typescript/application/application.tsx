import {h} from 'preact'
import {View} from '../decorators/view'
import {QuillComponent} from '../util/quill-component'
import {Route} from '../decorators/router'
import './application.pcss'

@View
export class Application extends QuillComponent {

    @Route('/')
    mainPage() {
        return import('./pages/main-page')
    }

}
