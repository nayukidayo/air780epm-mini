Component({
  properties: {
    value: {
      type: Object,
    },
  },
  data: {

  },
  methods: {
    onTap(e) {
      wx.navigateTo({ url: `/pages/info/info?id=${e.mark.id}` })
    },
  }
})