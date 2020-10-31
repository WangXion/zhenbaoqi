//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad() {

  },
  //微信登录
  goLogin() {
      wx.navigateTo({
        url: '../shouquan/shouquan'
      })
  },
  // //去手机号绑定页
  // goPhone() {
  //   wx.navigateTo({
  //     url: '../register/register'
  //   })
  // }
})