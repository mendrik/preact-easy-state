import {observable} from '@nx-js/observer-util'
import {LocalStorage, Store} from '../decorators/local-storage'
import {Cell} from '../components/grid/grid'
import {CustomNode} from './custom-node'

export class Data {
    text = 'My little demo text'
    integer = 10
    float = 10.5
    bool = false
    date = new Date()
    datetime = new Date()
    tree: CustomNode[] = []
    data: Cell[][] = [[]]
    modal: boolean
    progress = false
}

export default observable(new Data())
