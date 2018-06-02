import {observable, observe} from '@nx-js/observer-util'
import {Cell} from '../components/grid/grid'
import {CustomNode} from './custom-node'
import {Contains, IsInt, Max, Min} from 'class-validator'

class Data {
    @Contains('hello')
    text = 'Hello Andreas'

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

const model = observable(new Data())
observe(() => console.log(model.bool))
export {model, Data}
