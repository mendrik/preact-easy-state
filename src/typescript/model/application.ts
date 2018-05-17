import {observable} from '@nx-js/observer-util'
import {LocalStorage, Store} from '../decorators/local-storage'

@LocalStorage
class Data {
    @Store('count') counter = 0
    list = []
}

export default observable(new Data())
