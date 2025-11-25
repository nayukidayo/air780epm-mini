const app = getApp()

Page({
  data: {
    name: '',
    device: null,
    tips: '',
  },
  prop: {
    title: {
      name: '设备名称',
      interval: '采集间隔',
      location: '安装位置',
    },
  },
  onLoad({ name }) {
    const title = this.prop.title[name]
    if (!title) return
    wx.setNavigationBarTitle({ title })
    this.getOpenerEventChannel().once('opener', device => {
      this.setData({ name, device })
    })
  },
  onSubmitName(e) {
    const name = e.detail.value.name.trim()
    if (!name) {
      this.setData({ tips: '设备名称不能为空' })
      return
    }
    this.setData({ tips: '' })
    this.updateDevice(this.data.device.id, { name })
  },
  onSubmitInterval(e) {
    const interval = Number(e.detail.value.interval)
    if (!(interval > 0)) {
      this.setData({ tips: '采集间隔必须大于0' })
      return
    }
    this.setData({ tips: '' })
    this.updateDevice(this.data.device.id, {
      config: JSON.stringify({ interval }),
      config_version: this.data.device.config_version + 1,
      config_updated: new Date().toISOString(),
    })
  },
  onSubmitLocation(e) {
    this.updateDevice(this.data.device.id, e.detail.value)
  },
  updateDevice(id, data) {
    wx.showLoading({ title: '保存中', mask: true })
    wx.request({
      method: 'PATCH',
      url: `${app.globalData.pb}/api/collections/devices/records/${id}`,
      data,
      success: res => {
        if (res.statusCode !== 200) {
          wx.showToast({ title: '保存失败', icon: 'error' })
          return
        }
        this.getOpenerEventChannel().emit('opened', res.data)
        wx.navigateBack()
      },
      fail: err => {
        wx.showToast({ title: '保存失败', icon: 'error' })
        console.log(err.errMsg)
      },
      complete: () => wx.hideLoading()
    })
  },
})