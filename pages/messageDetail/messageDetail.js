
const app = getApp()

Page({
  data: {
    type: 0,
    url: ''
  },
  onLoad(options) {
    if (options.type == 4) {
      this.setData({
        type: 4,
        url: decodeURIComponent(options.path)
      })
    }
  }
})