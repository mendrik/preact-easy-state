import {observable} from '@nx-js/observer-util'
import {LocalStorage, Store} from '../decorators/local-storage'

@LocalStorage
class Data {
    @Store('count') counter = 0
    list = []
}

const observed = observable(new Data())

export default observed
