const app = getApp()

Page({
  data: {
    search: '',
    isRefresh: false,
    isLower: false,
    devices: [],
  },
  prop: {
    pageNumber: 1,
    pageSize: 30,
    hasNextPage: false,
    isScanBack: false,
  },
  onLoad() {
    app.onLoginSuccess(() => this.onRefresh())
  },
  onShow() {
    if (this.prop.isScanBack) {
      this.prop.isScanBack = false
      return
    }
    this.onRefresh()
  },
  onScanClick() {
    this.prop.isScanBack = true
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res => {
        if (res.result.length !== 15) {
          wx.showToast({ title: '未知的设备', icon: 'error', duration: 2000 })
          return
        }
        wx.navigateTo({ url: `/pages/add/add?imei=${res.result}` })
      },
      fail: () => {
        wx.showToast({ title: '解析二维码失败', icon: 'error', duration: 2000 })
      }
    })
  },
  onSearch() {
    this.onRefresh()
  },
  onRefresh() {
    this.prop.pageNumber = 1
    this.listDevice('isRefresh', devices => {
      this.setData({ devices })
    })
  },
  onLower() {
    this.prop.pageNumber++
    this.listDevice('isLower', devices => {
      this.setData({ devices: this.data.devices.concat(devices) })
    })
  },
  listDevice(loading, callback) {
    const user = app.globalData.user
    if (!user) return
    this.setData({ [loading]: true })
    wx.request({
      url: `${app.globalData.pb}/api/collections/devices/records`,
      data: {
        page: this.prop.pageNumber,
        perPage: this.prop.pageSize,
        filter: `(name~'${this.data.search}' && user='${user.id}')`,
        sort: '-created',
        fields: 'id,name,imei,temp,hum,data_updated,config',
        skipTotal: 1,
      },
      success: res => {
        if (res.statusCode !== 200) {
          wx.showToast({ title: '加载失败', icon: 'error' })
          return
        }
        this.prop.hasNextPage = res.data.items.length === this.prop.pageSize
        callback(res.data.items)
      },
      fail: err => {
        wx.showToast({ title: '加载失败', icon: 'error' })
        console.log(err.errMsg)
      },
      complete: () => this.setData({ [loading]: false })
    })
  },
})