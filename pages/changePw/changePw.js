const app = getApp()

Page({
  data: {
    phone: '',
    code: '',
    disabled: false,
    time: '获取验证码',
    currentTime: 60,
    btn: false,
    state: 2,
    inviteCode: 0 //邀请码
  },
  onLoad(options) {
    if(wx.getStorageSync('inviteCode')){
      var inviteCode = wx.getStorageSync('inviteCode');
      this.setData({
        inviteCode: inviteCode
      })
    }else{
      this.setData({
        inviteCode:0
      })
    }
    this.setData({
      state: options.state,
    })
  },
  //输入手机号
  bindPhone(e) {
    var lengths = e.detail.cursor;
    if (lengths > 0) {
      this.setData({
        setCode: true,
        phone: e.detail.value,
        btn: true
      })
    } else {
      this.setData({
        setCode: false,
        phone: e.detail.value,
        btn: false
      })
    }
  },
  //输入验证码
  setCode(e) {
    this.setData({
      code: e.detail.value
    })
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
  //提交
  submit() {
    var token = wx.getStorageSync('token');
    if (this.data.code.length <= 0) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (this.data.phone.length < 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/bind/phone',
        method: 'post',
        data: {
          "phone_no": this.data.phone,
          "code": this.data.code,
          "invitation_code": this.data.inviteCode
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          "token": token
        },
        success(res) {
          console.log(res)
          if (res.data.tip == '验证码错误') {
            wx.showToast({
              title: '验证码错误',
              icon: 'none',
              duration: 2000
            });
          } else if (res.data.tip == '成功') {
            wx.setStorageSync('user_data', res.data)
            wx.setStorageSync('token', res.data.token)
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.reLaunch({
                url: '../index/index'
              })
            }, 1100)
          } else if (res.data.tip == "已绑定手机号") {
            wx.showToast({
              title: '该手机号已绑定过',
              icon: 'none',
              duration: 2000
            });
          } else if (res.data.tip == '请输入验证码') {
            wx.showToast({
              title: '请输入验证码',
              icon: 'none',
              duration: 2000
            });
          } else if (res.data.tip == "验证码已无效") {
            wx.showToast({
              title: '验证码失效',
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
    }
  },
  //微信登录
  goLogin() {
    var token = wx.getStorageSync('token');
    wx.login({
      success(res) {
        // console.log(res)
        let code = res.code
        wx.getUserInfo({
          success(res) {
            // console.log(res)
            wx.request({
              url: 'https://www.zbq888.cn/api/v1/user/bind/wx',
              method: 'post',
              data: {
                "code": code,
                "encryptedData": res.encryptedData,
                "iv": res.iv
              },
              header: {
                'content-type': 'application/json',
                "client": 1,
                "token": token
              },
              success(res) {
                console.log(res)
                if (res.data.tip == '获取成功') {
                  wx.setStorageSync('user_data', '');
                  wx.setStorageSync('token', "");
                  wx.showToast({
                    title: '绑定成功请重新登录',
                    icon: 'none',
                    duration: 2000
                  });
                  setTimeout(function () {
                    wx.reLaunch({
                      url: '../login/login'
                    })
                  }, 1100)
                }
              }
            })
          }
        })
      }
    })
  },
})