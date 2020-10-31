const app = getApp()

Page({
  data: {
    link: ''
  },
  onLoad(options) {
    var path = decodeURIComponent(options.path)
    this.setData({
      link: path
    })
  }
})