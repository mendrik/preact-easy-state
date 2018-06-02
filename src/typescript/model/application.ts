import {observable} from '@nx-js/observer-util'
import {Cell} from '../components/grid/grid'
import {CustomNode} from './custom-node'
import {Contains, IsInt, Max, Min} from 'class-validator'

export enum RadioValue {
    VALUE1,
    VALUE2,
    VALUE3
}

class Data {
    @Contains('Hello')
    text = 'Hello Andreas'

    @IsInt()
    @Min(0)
    @Max(10)
    integer = 10

    radio = RadioValue.VALUE1
    float = 10.5
    bool = false
    date = new Date()
    datetime = new Date()
    tree: CustomNode[] = []
    data: Cell[][] = [[]]
    modal: boolean
    progress = false
    autoSuggest = undefined
}

const model = observable(new Data())
export {model, Data}
