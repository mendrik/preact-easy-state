import {Application} from './application'
import {createElement} from 'inferno-create-element'
import {findRenderedVNodeWithType} from 'inferno-test-utils'
import {expect} from 'chai'
import {render} from 'inferno'

describe('<Application />', () => {
    it('renders without exploding', () => {
        const app = render(<Application/>, document.documentElement)
        expect(findRenderedVNodeWithType(app, 'h1')).to.not.be.undefined
    })
})
