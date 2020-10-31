//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    url: ""
  },
  onLoad(options) {
    if (options.index == 1) {
      this.setData({
        url: 'https://www.zbq888.cn/zhen_url/user_agreement.html'
      })
    } else {
      this.setData({
        url: 'https://www.zbq888.cn/zhen_url/privacy_agreement.html'
      })
    }
  }
})