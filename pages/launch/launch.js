import * as request from '../../utils/request'

Page({
  onLoad() {
    this.login().then(() => {
      wx.redirectTo({ url: "/pages/index/index" })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '登录失败',
        showCancel: false,
        confirmText: '重新登录',
        success: res => {
          if (res.confirm) {
            this.onLoad()
          }
        }
      })
    })
  },

  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: async res => {
          try {
            const data = await request.post('/api/wen/token', { code: res.code }, false)
            wx.$global.user = data.user
            wx.$global.token = data.token
            wx.setStorage({ key: 'token', data: data.token })
            resolve()
          } catch (err) {
            reject(err)
          }
        },
        fail: reject
      })
    })
  }
})