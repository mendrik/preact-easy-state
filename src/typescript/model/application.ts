import {observable} from '@nx-js/observer-util'
import {Cell} from '../components/grid/grid'
import {CustomNode} from './custom-node'
import {Contains, IsInt, Max, Min} from 'class-validator'

export class Data {
    @Contains('hello')
    text = 'My little demo text'

    @IsInt()
    @Min(0)
    @Max(10)
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
