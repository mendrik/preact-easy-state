import '../../node_modules/bulma/css/bulma.css'
import '../../node_modules/@mdi/font/css/materialdesignicons.css'
import {Application} from './application/application'
import {h, render} from 'preact'
import {fetchJson} from './decorators/fetch'
import {domReady} from './util/utils'
import {initTranslations} from './util/localization'

(async () => {
    const [locales] = await Promise.all([
        fetchJson('/locales.json'),
        domReady()
    ])
    initTranslations(locales)
    render(<Application/>, document.body)
})()
