//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
 

  },
  onLoad() {},
  //微信登录
  goLogin() {
    var that = this;
    wx.login({
      success(res) {
        // console.log(res)
        let code = res.code
        wx.getUserInfo({
          success(res) {
            // console.log(res)
            wx.request({
              url: 'https://www.zbq888.cn/api/v1/user/decode/userInfo',
              method: 'post',
              data: {
                "code": code,
                "encryptedData": res.encryptedData,
                "iv": res.iv
              },
              header: {
                'content-type': 'application/json',
                "client": 1
              },
              success(res) {
                // console.log(res)
                if (res.data.state == 1) {
                  wx.showToast({
                    title: '需要绑定手机号',
                    icon: 'none',
                    duration: 1000
                  });
                  wx.setStorageSync('user_data', res.data)
                  wx.setStorageSync('token', res.data.token)
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../changePw/changePw?state=1'
                    })
                  }, 1100)
                } else if (res.data.state == 3) {
                  wx.setStorageSync('user_data', res.data)
                  wx.setStorageSync('token', res.data.token)
                  wx.reLaunch({
                    url: '../index/index'
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  // //去手机号绑定页
  // goPhone() {
  //   wx.navigateTo({
  //     url: '../register/register'
  //   })
  // }
})