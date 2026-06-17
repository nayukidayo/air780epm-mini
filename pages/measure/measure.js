import { origin } from '../../utils/request'

Page({
  data: {
    url: ''
  },

  onLoad({ id }) {
    this.setData({ url: `${origin}?device_id=${id}` })
  }
})