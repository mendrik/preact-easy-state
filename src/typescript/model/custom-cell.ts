import {Cell} from '../components/grid/grid'

export class CustomCell implements Cell {
    text: string

    constructor(text: string) {
        this.text = text
    }

    toString = () => this.text
}

