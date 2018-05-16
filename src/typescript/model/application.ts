import {observable} from '@nx-js/observer-util'

const data = {
    counter: 0,
    list: []
}

export default observable(data)
