import {JSDOM} from 'jsdom'
import matchMediaPolyfill from 'mq-polyfill'
import 'isomorphic-fetch'

const window = new JSDOM('<!doctype html><html><body></body></html>', {url: 'https://example.org/'}).window
matchMediaPolyfill(window)

const copy = ['document', 'location', 'history', 'matchMedia', 'CustomEvent', 'Node', 'NodeFilter', 'MouseEvent', 'DOMParser']

global['window'] = window
copy.forEach(prop => global[prop] = window[prop])
