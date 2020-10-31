//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    array: [],
    index: 0
  },
  onLoad() {

  },
  onShow() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //获取银行列表
      url: 'https://www.zbq888.cn/api/v1/bank/list',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success: res => {
        console.log(res)
        if (res.data.mark == 502) {
          wx.showToast({
            title: '请先实名认证',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        } else {
          that.setData({
            array: res.data.list
          })
        }

      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  addBank() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //添加银行卡
      url: 'https://www.zbq888.cn/api/v1/user/bank/add',
      method: 'post',
      data: {
        "bank_card_num": "string",
        "bank_id": 0
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success: res => {
        console.log(res)
      }
    })
    // wx.request({ //编辑银行卡
    //   url: 'https://www.zbq888.cn/api/v1/user/bank/update',
    //   method: 'post',
    //   data: {
    //     "bank_card_num": "string",
    //     "bank_id": 0,
    //     "user_bank_id": 0
    //   },
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     "client": 1,
    //     'token': token
    //   },
    //   success: res => {
    //     console.log(res)
    //   }
    // })
  }
})