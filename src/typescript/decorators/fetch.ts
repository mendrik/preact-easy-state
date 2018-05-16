import {Component} from 'inferno/core/component'
import {ensure} from '../util/ensure'
import {addToMountQueue} from '../util/construct'

export type Processor = (res: Response) => Promise<any>

export interface RequestWithUrl extends RequestInit {
    processor?: Processor
}

class ResponseError extends Error {

    response: Response

    constructor(message: string, response: Response) {
        super(message)
        this.response = response
    }
}

const handleErrors = (component: Component, response: Response) => {
    if (!response.ok) {
        if (failures.has(component)) {
            failures
            .get(component)
            .forEach(handler => {
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

const Fetch = (method: string) => (url: string, req: RequestWithUrl = {}) => (proto: any, protoMethod: string) => {
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

export const Get = Fetch('GET')
export const Post = Fetch('POST')
export const Delete = Fetch('DELETE')
export const Option = Fetch('OPTION')
export const Put = Fetch('PUT')

export type AcceptStatus = (status: number) => boolean

const failures = new WeakMap<Component, Array<FailureHandler>>()

interface FailureHandler {
    filter: AcceptStatus,
    callback: Function
}

export const FetchFailure = (filter: AcceptStatus | number) => (proto: any, method: string) => {
    const finalFilter: AcceptStatus = Number.isInteger(filter as number) ? ((s: number) => s === filter) : filter as AcceptStatus
    addToMountQueue(proto, (comp: Component) => {
        ensure(failures, comp, [{filter: finalFilter, callback: proto[method]}])
    })
}
