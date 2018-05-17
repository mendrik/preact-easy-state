import {h} from 'preact'
import model from '../model/application'
import {View} from '../decorators/view'
import {QuillComponent} from '../util/quill-component'
import {Route} from '../decorators/router'

setInterval(() => model.counter++, 1000)

@View
export class Application extends QuillComponent {

    @Route('/')
    mainPage() {
        return import('./pages/main-page')
    }

}
