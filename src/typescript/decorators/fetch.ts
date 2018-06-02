import {ensure, resolve} from '../util/ensure'
import {QuillComponent, QuillComponentClass} from '../util/quill-component'

export type Processor = (res: Response) => Promise<any>

export interface ExtendedRequest extends RequestInit {
    processor?: Processor
}

export class ResponseError extends Error {

    response: Response

    constructor(message: string, response: Response) {
        super(message)
        this.response = response
    }
}

const handleErrors = (component: QuillComponent, response: Response) => {
    if (!response.ok) {
        const failures = resolve(failuresReg, component, 'constructor')
        if (failures) {
            failures.forEach(handler => {
                if (handler.filter(response.status)) {
                    handler.callback.call(component, response)
                }
            })
            return
        } else {
            throw new ResponseError(response.statusText, response)
        }
    }
    return response
}

const Fetch = (method: string) => (url: string, req: ExtendedRequest = {}) => (proto: QuillComponentClass, protoMethod: string) => {
    Object.defineProperty(proto, protoMethod, {
        value: function (body?: any) {
            const headers = req.headers || {'Content-Type': 'application/json'}
            const mode = req.mode || 'cors'
            const processor = req.processor || ((res: Response) => res.json())
            const finalConfig = {...req, method, body, headers, mode}
            return fetch(url, finalConfig)
                .then(res => handleErrors(this, res))
                .then(res => res ? processor(res) : undefined)
        },
        writable: true,
        enumerable: true,
        configurable: true
    })
}

export const fetchJson = async <T = {}>(url: string, req: ExtendedRequest = {}): Promise<T> => {
    const fetcher = {
        fetch: () => 0 as any
    }
    Get(url, req)(fetcher, 'fetch')
    return fetcher.fetch()
}

export const Get = Fetch('GET')
export const Post = Fetch('POST')
export const Delete = Fetch('DELETE')
export const Option = Fetch('OPTION')
export const Put = Fetch('PUT')

export type AcceptStatus = (status: number) => boolean

const failuresReg = new WeakMap<QuillComponent, Array<FailureHandler>>()

interface FailureHandler {
    filter: AcceptStatus,
    callback: Function
}

export const FetchFailure = (filter: AcceptStatus | number) => (proto: QuillComponentClass, method: string) => {
    const finalFilter: AcceptStatus = Number.isInteger(filter as number) ? ((s: number) => s === filter) : filter as AcceptStatus
    ensure(failuresReg, proto.constructor, [{filter: finalFilter, callback: proto[method]}])
}
