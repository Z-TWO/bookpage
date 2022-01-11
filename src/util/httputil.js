import request from './axiosconfig'
import QS from 'qs'

export function getRequest(uri, params) {
    return request({
        url: uri,
        method: 'get',
        params: params
    })
}

export function postRequest(uri, params, json) {
    return request({
        url: uri,
        method: 'post',
        data: json ? JSON.stringify(params) : QS.stringify(params)
    })
}

export function postJsonRequest(uri, params) {
    return request({
        url: uri,
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify(params)
    })
}

export function deleteRequest(uri, params) {
    return request({
        url: uri,
        method: 'delete',
        params: params
    })
}

export function putRequest(uri, params, json) {
    return request({
        url: uri,
        method: 'put',
        data: json ? JSON.stringify(params) : QS.stringify(params)
    })
}