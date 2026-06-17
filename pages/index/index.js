import * as request from '../../utils/request'

Page({
  data: {
    records: [],
    isRefresh: false,
    isLower: false,
    search: '',
  },

  onLoad() {
    this._page = 1
    this._pageSize = 30
    this._hasNextPage = false
    this._isScanBack = false
    wx.hideHomeButton()
  },

  async onShow() {
    if (this._isScanBack) {
      this._isScanBack = false
      return
    }
    this._page = 1
    const records = await this.loadPage()
    this.setData({ records })
  },

  async onRefresh() {
    this._page = 1
    this.setData({ isRefresh: true })
    const records = await this.loadPage()
    this.setData({ isRefresh: false, records })
  },

  async onLower() {
    if (!this._hasNextPage) return
    this._page++
    this.setData({ isLower: true })
    const records = await this.loadPage()
    this.setData({ isLower: false, records: this.data.records.concat(records) })
  },

  async loadPage() {
    try {
      const data = { page: this._page, page_size: this._pageSize, name: this.data.search }
      const records = await request.get('/api/wen/device', data)
      this._hasNextPage = data.length === this._pageSize
      return records
    } catch (err) {
      console.log(err)
      wx.showToast({ icon: 'none', title: '加载失败' })
      return []
    }
  },

  onScanClick() {
    this._isScanBack = true
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res => {
        if (res.result.length !== 15) {
          wx.showToast({ icon: 'none', title: '未知的设备' })
          return
        }
        this._isScanBack = false
        wx.navigateTo({ url: `/pages/add/add?imei=${res.result}` })
      },
      fail: (err) => {
        if (err.errMsg === 'scanCode:fail cancel') return
        wx.showToast({ icon: 'none', title: '解析二维码失败' })
      }
    })
  },

  onSearch() {
    this.onShow()
  },
})