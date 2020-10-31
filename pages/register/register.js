//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    time: '发送验证码',
    currentTime: 60,
    disabled: false,
    checked: false,
    color: "rgba(225, 225, 225, 1)",
    items: [{
      name: 'CHN',
      value: '中国',
      checked: false
    }],
    phone: '',
    code: '',
    userID: '',
  },
  onLoad() {

  },
  //手机号
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //邀请码
  setUserID(e) {
    this.setData({
      userID: e.detail.value
    })
  },
  //去登录
  goLogin() {
    if (this.data.code.length <= 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      });
    } else if (this.data.checked == false) {
      wx.showToast({
        title: '请先选中《用户协议》和《隐私政策》',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/login',
        method: 'post',
        data: {
          "phone_no": this.data.phone,
          "code": this.data.code,
          "push_code": "asklfjo",
          "invitation_code": this.data.userID
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1
        },
        success: res => {
          console.log(res)
          wx.request({ //获取聊天Sig
            url: 'https://www.zbq888.cn/api/v1/chat/userSig',
            method: 'post',
            data: {},
            header: {
              'content-type': 'application/json', // 默认值
              "client": 1,
              'token': res.data.token
            },
            success: res => {
              wx.setStorageSync('Sig', res.data.data)
            }
          })
          if (res.data.tip == '验证码已无效') {
            wx.showToast({
              title: '验证码已无效',
              icon: 'none',
              duration: 1000
            });
          } else {
            if (res.data.state == 2) {
              wx.setStorageSync('user_data', res.data)
              wx.setStorageSync('token', res.data.token)
              wx.showToast({
                title: '需要绑定微信',
                icon: 'none',
                duration: 1000
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../changePw/changePw?state=' + 2
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

        }
      })
    }
  },
  //获取验证码
  getCode() {
    var that = this;
    var phone = that.data.phone;
    var currentTime = that.data.currentTime;
    var interval;
    if (phone.length !== 11) { //判断手机号格式
      wx.showToast({
        title: '手机格式错误!',
        icon: "none",
        duration: 2000,
        mask: true
      })
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/send/message',
        method: 'post',
        data: {
          "phone_no": phone
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1
        },
        success: res => {
          if (res.data.tip == '成功') {
            wx.showToast({
              title: '短信验证码已发送',
              icon: 'success',
              duration: 2000
            });
            that.setData({
              time: currentTime + 's',
              disabled: true
            })
            interval = setInterval(function () {
              that.setData({
                time: (currentTime - 1) + ' s',
              })
              currentTime--;
              if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                  time: '重新获取',
                  currentTime: 60,
                  disabled: false
                })
              }
            }, 1000)
          } else if (res.data.tip == "短信发送失败") {
            wx.showToast({
              title: '短信发送失败，请稍后重试',
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
    }
  },
  //输入验证码
  setCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //去协议
  geXieyi(e) {
    wx.navigateTo({
      url: '../protocol/protocol?index=' + e.currentTarget.dataset.index
    })
  },
  //复选框选中
  checkboxChange(e) {
    if (e.detail.value.length == 0) {
      this.setData({
        checked: false,
        color: "rgba(225, 225, 225, 1)"
      })
    } else {
      this.setData({
        checked: true,
        color: "red"
      })
    }
  }
})