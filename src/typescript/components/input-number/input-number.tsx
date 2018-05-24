import {InputText} from '../input-text/input-text'
import {View} from '../../decorators/view'

@View
export class InputNumber extends InputText {

    getType = () => 'number'

}
