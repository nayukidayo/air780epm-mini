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
      wx.navigateTo({ url: `/pages/view/view?id=${e.mark.id}` })
    },
  }
})