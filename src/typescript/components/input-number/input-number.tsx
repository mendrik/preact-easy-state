import {View} from '../../decorators/view'
import {InputText} from '../input-text/input-text'

@View
export class InputNumber extends InputText {

    getType = () => 'number'

}
