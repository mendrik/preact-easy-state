import {h} from 'preact'
import {QuillComponent} from '../util/quill-component'
import {Route} from '../decorators/router'
import '../util/localization'
import './application.pcss'
import {View} from '../decorators/view'

@View
export class Application extends QuillComponent {

    @Route('/')
    mainPage(): any {
        return import('./pages/main-page').then(c => c)
    }

}
