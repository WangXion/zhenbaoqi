//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user_lv: {},
    user_data: {},
    lv: {}
  },
  onLoad() {
    var user_lv = wx.getStorageSync('user_lv');
    var user_data = wx.getStorageSync('user_data');
    this.setData({
      user_lv: user_lv,
      user_data: user_data
    })
    this.getLv()
  },
  getLv() {
    var that = this;
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/welfare/pointRuleList',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json',
        'client': 1,
        'token': '1'
      },
      success(res) {
        console.log(res)
        that.setData({
          lv: res.data.data
        })
      },
      fail(res) {
        console.log(res);
      }
    });
  }
})