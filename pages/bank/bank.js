//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bank: []
  },
  onLoad() {
    this.setData({
      slideButtons: [{
        text: '编辑',
        extClass: '#btn2'
      }, {
        text: '删除',
        extClass: '#btn'
      }],
    });
  },
  onShow() {
    this.getList();
  },
  //获取银行卡列表
  getList() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //获取银行卡列表
      url: 'https://www.zbq888.cn/api/v1/user/bank/listt',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success: res => {
        console.log(res)
      }
    })
  },
  //删除银行卡
  slideButtonTap(e) {
    // console.log(e.detail)
    if (e.detail.index == 1) {
      var that = this;
      var token = wx.getStorageSync('token');
      wx.request({ //删除银行卡
        url: 'https://www.zbq888.cn/api/v1/user/bank/delete',
        method: 'post',
        data: {
          "user_bank_id": 0
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
      that.getList();
    } else {
      wx.navigateTo({
        url: '../addBank/addBank'
      })
    }

  },
  goAdd() {
    wx.navigateTo({
      url: '../addBank/addBank'
    })
  }
})