import 'bulma/css/bulma.css'
import '@mdi/font/css/materialdesignicons.css'
import {Application} from './application/application'
import {h, render} from 'preact'
import {fetchJson} from './decorators/fetch'
import {domReady} from './util/utils'
import {initTranslations} from './util/localization'

(async () => {
    const [locales] = await Promise.all([
        fetchJson('locales.json'),
        domReady()
    ])
    const appHeight = () => {
        const doc = document.documentElement
        doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()
    initTranslations(locales)
    render(<Application/>, document.body)
})()
