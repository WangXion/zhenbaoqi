//index.js
//获取应用实例
const app = getApp()
const utilMd5 = require('../../../utils/md5');
Page({
  data: {
    url: ''
  },
  onLoad() {

  },
  //支付
  goPay() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/apply/merchants',
      method: 'post',
      data: {
        pay_type: 4
      },
      header: {
        "client": 1,
        token: token
      },
      dataType: "json",
      success: res => {
        console.log(res)
        if (res.data.mark == 502) {
          wx.showToast({
            title: '您未实名认证',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
        var stringA = "appId=" + res.data.mini_appId + "&nonceStr=" + res.data.noncestr + "&package=" + res.data.mini_package + "&signType=MD5" + "&timeStamp=" + res.data.timestamp + "&key=sTuNmbuf9NVblCOsLKDig2wibJUSKEBg";
        var paySign = utilMd5.hexMD5(stringA);
        wx.requestPayment({
          timeStamp: res.data.timestamp,
          nonceStr: res.data.noncestr,
          package: res.data.mini_package,
          signType: 'MD5',
          paySign: paySign,
          appId: res.data.mini_appId,
          success(ress) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '../xinrenfuli/xinrenfuli'
              })
            }, 1000)
          },
          fail(ress) {
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '您取消了支付',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          }
        })
      }
    })
  }

})