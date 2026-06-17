import * as request from '../../utils/request'

Page({
  data: {
    imei: '',
  },

  onLoad({ imei }) {
    this.setData({ imei })
  },

  async onSubmit(e) {
    const name = e.detail.value.name.trim()
    if (name.length === 0) {
      wx.showToast({ icon: 'none', title: '设备名称不能为空' })
      return
    }
    const imei = e.detail.value.imei
    if (imei.length !== 15) {
      wx.showToast({ icon: 'none', title: '设备IMEI无效' })
      return
    }
    const interval = Number(e.detail.value.interval) || 0
    if (interval <= 0) {
      wx.showToast({ icon: 'none', title: '采集间隔必须大于0' })
      return
    }
    const location = e.detail.value.location.trim()
    try {
      wx.showLoading({ title: '绑定中', mask: true })
      const data = { imei, name, location, config: { interval } }
      await request.post('/api/wen/device', data)
      wx.showToast({ icon: 'none', title: '绑定成功' })
      setTimeout(() => wx.navigateBack(), 1500)
    } catch (err) {
      console.log(err)
      if (err.statusCode === 409) {
        wx.showToast({ icon: 'none', title: '设备已绑定' })
      } else {
        wx.showToast({ icon: 'none', title: '绑定失败' })
      }
    } finally {
      wx.hideLoading()
    }
  },
})