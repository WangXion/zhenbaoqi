const app = getApp()

Page({
  data: {
    switch1Checked: true,
    num: "0.00"
  },
  onLoad() {
    var num = Math.random() * (10 - 5) + 5 + '';
    num = num.slice(0, 4)
    this.setData({
      num: num
    })
  },
  onShow() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/push/switch',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        "token": token
      },
      success(res) {
        if (res.data.push_switch == 0) {
          that.setData({
            switch1Checked: true
          })
        } else {
          that.setData({
            switch1Checked: false
          })
        }
      }
    })
  },
  //清除缓存
  clear() {
    this.setData({
      num: "0.00"
    })
    wx.showToast({
      title: '清理成功',
      icon: 'success',
      duration: 2000
    });
  },
  //推送开关
  switch1Change(e) {
    var switchs = e.detail.value;
    if (switchs == false) {
      switchs = 1
    } else {
      switchs = 0
    }
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/push/switch/update',
      method: 'post',
      data: {
        "push_switch": switchs
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        "token": token
      },
      success(res) {
        if (res.data.tip == "成功") {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          });
        }
      }
    })
  },
  //退出登录
  logOut() {
    wx.removeStorage({
      key: 'token',
      success() {
        wx.removeStorage({
          key: 'user_data',
          success(res) {
            wx.reLaunch({
              url: '../login/login'
            })
          }
        })
      }
    })
  }
})