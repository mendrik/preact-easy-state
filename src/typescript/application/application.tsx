import {h} from 'preact'
import {QuillComponent} from '../util/quill-component'
import {Route} from '../decorators/router'
import '../util/localization'
import './application.pcss'
import {View} from '../decorators/view'
import {IPage} from './pages/main-page'

@View
export class Application extends QuillComponent {

    @Route('/')
    async mainPage(): Promise<IPage> {
        return await import('./pages/main-page')
    }

}
