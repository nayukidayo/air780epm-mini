// export const origin = 'http://127.0.0.1:8090'
export const origin= 'https://temphum.dev.nayuki.top'

export function get(api, data, auth = true) {
  return req(api, 'GET', data, auth)
}

export function post(api, data, auth = true) {
  return req(api, 'POST', data, auth)
}

export function patch(api, data, auth = true) {
  return req(api, 'PATCH', data, auth)
}

export function del(api, data, auth = true) {
  return req(api, 'DELETE', data, auth)
}

function req(api, method, data, auth) {
  return new Promise((resolve, reject) => {
    const header = {}
    if (auth) {
      header.Authorization = wx.$global.token
    }
    wx.request({
      method, data, header,
      url: origin + api,
      timeout: 10_000,
      success: res => {
        if (res.statusCode !== 200 && res.statusCode !== 204) return reject(res)
        resolve(res.data)
      },
      fail: reject
    })
  })
}
