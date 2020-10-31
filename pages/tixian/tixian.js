const app = getApp()

Page({
  data: {
    bank_name: '中国银行',
    num: "0.00",
    card_img: ''
  },
  onLoad() {

  },
  //提交
  submit() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/cash/add',
      method: 'post',
      data: {
        "amount": that.data.num * 100,
        "user_bank_id": 0
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        console.log(res)
        if (res.data.mark == 502) {
          wx.showToast({
            title: '请先实名认证',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  //提现金额
  money(e) {
    if (e.detail.value > 5000.00) {
      wx.showToast({
        title: '提现金额不能大于5000.00',
        icon: 'none',
        duration: 2000
      });
    } else {
      this.setData({
        num: e.detail.value
      })
    }
  },
  goBank() {
    wx.navigateTo({
      url: '../bank/bank'
    })
  }
})