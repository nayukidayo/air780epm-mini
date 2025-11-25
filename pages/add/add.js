const app = getApp()

Page({
  data: {
    imei: '',
    tips: '',
  },
  onLoad({ imei }) {
    if (!imei) return
    this.setData({ imei })
  },
  onSubmit(e) {
    const user = app.globalData.user
    if (!user) {
      wx.showToast({ title: '未登录', icon: 'error' })
      return
    }
    const name = e.detail.value.name.trim()
    if (!name) {
      this.setData({ tips: '设备名称不能为空' })
      return
    }
    const imei = e.detail.value.imei
    if (imei.length !== 15) {
      this.setData({ tips: '设备IMEI无效' })
      return
    }
    const interval = Number(e.detail.value.interval)
    if (!(interval > 0)) {
      this.setData({ tips: '采集间隔必须大于0' })
      return
    }
    this.setData({ tips: '' })
    this.createDevice({
      name, imei,
      location: e.detail.value.location,
      config: JSON.stringify({ interval }),
      config_version: 1,
      config_updated: new Date().toISOString(),
      user: user.id

    })
  },
  createDevice(data) {
    wx.showLoading({ title: '绑定中', mask: true })
    wx.request({
      method: 'POST',
      url: `${app.globalData.pb}/api/collections/devices/records`,
      data,
      success: res => {
        if (res.statusCode === 400 && res.data.data.imei) {
          wx.showToast({ title: '设备已绑定', icon: 'error', duration: 2000 })
          return
        }
        if (res.statusCode !== 200) {
          wx.showToast({ title: '绑定失败', icon: 'error' })
          return
        }
        wx.navigateBack()
      },
      fail: err => {
        wx.showToast({ title: '绑定失败', icon: 'error' })
        console.log(err.errMsg)
      },
      complete: () => wx.hideLoading()
    })
  },
})