const app = getApp()

Page({
  data: {
    device: null
  },
  onLoad({ id }) {
    if (!id) return
    wx.showLoading({ title: '加载中', mask: true })
    wx.request({
      url: `${app.globalData.pb}/api/collections/devices/records/${id}`,
      success: res => {
        if (res.statusCode !== 200) {
          wx.showToast({ title: '加载失败', icon: 'error' })
          return
        }
        wx.setNavigationBarTitle({ title: res.data.name })
        this.setData({ device: res.data })
      },
      fail: err => {
        wx.showToast({ title: '加载失败', icon: 'error' })
        console.log(err.errMsg)
      },
      complete: () => wx.hideLoading()
    })
  },
  onCellClick(e) {
    const { name } = e.mark
    if (!name) return
    wx.navigateTo({
      url: '/pages/info/edit/edit?name=' + name,
      events: {
        opened: device => {
          wx.setNavigationBarTitle({ title: device.name })
          this.setData({ device })
        }
      },
      success: res => res.eventChannel.emit('opener', this.data.device)
    })
  },
  onUnbind() {
    wx.showModal({
      title: '解绑设备',
      content: '解绑会删除设备所有数据',
      success: res => {
        if (!res.confirm) return
        this.deleteDevice(this.data.device.id)
      }
    })
  },
  deleteDevice(id) {
    wx.showLoading({ title: '解绑中', mask: true })
    wx.request({
      method: 'DELETE',
      url: `${app.globalData.pb}/api/collections/devices/records/${id}`,
      success: res => {
        if (res.statusCode !== 204) {
          wx.showToast({ title: '解绑失败', icon: 'error' })
          return
        }
        wx.navigateBack()
      },
      fail: err => {
        wx.showToast({ title: '解绑失败', icon: 'error' })
        console.log(err.errMsg)
      },
      complete: () => wx.hideLoading()
    })
  }
})