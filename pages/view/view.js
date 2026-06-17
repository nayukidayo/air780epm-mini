import * as request from '../../utils/request'

Page({
  data: {
    record: null,
    visible: false,
    editName: '',
    editValue: '',
  },

  async onLoad({ id }) {
    this._id = id
    this._title = {
      name: '设备名称',
      interval: '采集间隔',
      location: '安装位置',
      temp_offset: '温度修正值',
      hum_offset: '湿度修正值',
      vbat_offset: '电压修正值'
    }
    try {
      const record = await request.get('/api/wen/device/' + id)
      this.setData({ record })
    } catch (err) {
      console.log(err)
      wx.showToast({ icon: 'none', title: '加载失败' })
    }
  },

  cellClick(e) {
    const name = e.mark.name
    const record = this.data.record
    const value = record[name] !== undefined ? record[name] : record.config[name].toString()
    this.setData({ visible: true, editName: e.mark.name, editValue: value })
  },

  beforeenter() {
    wx.setNavigationBarTitle({ title: this._title[this.data.editName] })
  },

  beforeleave() {
    wx.setNavigationBarTitle({ title: '设备信息' })
  },

  editChange(e) {
    this.setData({ editValue: e.detail.value })
  },

  editClear() {
    this.setData({ editValue: '' })
  },

  async tapSave() {
    const data = {}
    const record = this.data.record
    const name = this.data.editName
    const value = this.data.editValue.trim()
    if (record[name] !== undefined) {
      if (name === 'name' && value.length === 0) {
        wx.showToast({ icon: 'none', title: `${this._title[name]}不能为空` })
        return
      }
      data[name] = value
      this.setData({ visible: false, [`record.${name}`]: value })
    } else {
      const num = Number(value)
      if (Number.isNaN(num)) {
        wx.showToast({ icon: 'none', title: `不是有效数字` })
        return
      }
      if (name === 'interval' && num <= 0) {
        wx.showToast({ icon: 'none', title: `${this._title[name]}必须大于0` })
        return
      }
      data.config = { ...this.data.record.config }
      data.config[name] = num
      this.setData({ visible: false, [`record.config.${name}`]: num })
    }
    try {
      await request.patch('/api/wen/device/' + this._id, data)
    } catch (err) {
      console.log(err)
      wx.showToast({ icon: 'none', title: `设备配置更新失败` })
    }
  },

  historyClick() {
    wx.navigateTo({ url: '/pages/measure/measure?id=' + this._id })
  },

  unbind() {
    wx.showModal({
      title: '解绑提示',
      content: '解绑后可以重新绑定',
      confirmText: '解绑',
      success: res => {
        if (res.confirm) {
          request.del('/api/wen/device/' + this._id)
            .then(() => wx.navigateBack())
            .catch(err => {
              console.log(err)
              wx.showToast({ icon: 'none', title: `设备解绑失败` })
            })
        }
      }
    })
  },
})