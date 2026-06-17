import { origin } from '../../utils/request'

Page({
  data: {
    url: ''
  },

  onLoad({ id }) {
    const token = wx.$global.token
    this.setData({ url: `${origin}?device_id=${id}&token=${token}` })
  }
})