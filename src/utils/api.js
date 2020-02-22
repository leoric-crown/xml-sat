import config from '../config.json'

const api = config.API
const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
}

const request = (method, body, token = false) => {
    const request = {
        method,
        headers
    }

    if (body) request.body = body
    return request
}

export const unzip = payload => {
    console.log(payload)
    let data = new FormData()
    Object.entries(payload).forEach(keyValue => {
        data.append(keyValue[0], keyValue[1])
    })
    console.log(data, api)
    return fetch(`${api}/files/unzip`, {
        method: 'POST',
        body: data
    }).then(res => res.json())
    // return fetch(`${api}/files/unzip`, request('POST', JSON.stringify(payload)))
    //     .then(res => res.json())
    //     .catch(e => console.log(e))
}
export const hello = () => {
    return fetch(`${api}/hello`, request('GET', false)).then(
        res => res.json()
    )
}
