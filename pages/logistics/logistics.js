//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    firm: '申通快递',
    message: [],
    order_number: 0, //订单号
    },
  onLoad(options) {
    console.log(options)
    this.setData({
      order_number: options.id
    })
  },
  onShow() {
    this.getLogistics()
  },
  //获取物流信息
  getLogistics() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/order/courier',
      method: 'post',
      data: {
        order_number: that.data.order_number
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
       var info = res.data.third_day;
       var message =JSON.parse(info);
        console.log(message)
        that.setData({
          message: message.data
        })
      }
    })
  },
  //复制订单号码
  copyNum(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
})