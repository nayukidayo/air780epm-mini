// app.js
App({
  globalData: {
    user: null,
    // pb: 'http://127.0.0.1:8090',
    pb: 'https://temphum.dev.nayuki.top',
  },
  onLaunch() {
    const user = wx.getStorageSync('user')
    if (!user) return this.login()
    this.globalData.user = user
  },
  login() {
    wx.showLoading({ title: '登录中', mask: true })
    wx.login({
      success: res => {
        wx.request({
          url: `${this.globalData.pb}/api/js/user`,
          data: { code: res.code },
          success: res => {
            if (res.statusCode !== 200) {
              wx.showToast({ title: '登录失败', icon: 'error' })
              return
            }
            this.globalData.user = res.data
            wx.setStorageSync('user', res.data)
            this.notifyLoginSuccess()
          },
          fail: err => {
            wx.showToast({ title: '登录失败', icon: 'error' })
            console.log(err.errMsg)
          },
          complete: () => wx.hideLoading()
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({ title: '登录失败', icon: 'error' })
        console.log(err.errMsg)
      },
    })
  },
  notifyLoginSuccess() {
    if (this.loginSuccessCallback) {
      this.loginSuccessCallback()
    }
  },
  onLoginSuccess(callback) {
    this.loginSuccessCallback = callback
  },
})
