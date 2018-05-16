import {JSDOM} from 'jsdom'

const window = new JSDOM('<!doctype html><html><body></body></html>', {url: 'https://example.org/'}).window
const copy = ['document', 'location', 'history', 'matchMedia', 'CustomEvent', 'Node', 'NodeFilter', 'MouseEvent', 'DOMParser']

global['window'] = window
copy.forEach(prop => global[prop] = window[prop])
