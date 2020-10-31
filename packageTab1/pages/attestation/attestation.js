const app = getApp()

Page({
  data: {
    id: 0,
    detail: {}, //店铺详情
    guanZhu: 1,


  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.getStoreAuthentication(options.id)
  },
  //关注/取关
  guanzhu() {
    var that = this;
    var token = wx.getStorageSync('token');
    if (that.data.guanZhu == 0) {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/merchants/focus',
        method: 'post',
        data: {
          "focus_state": 1,
          "merchants_id": that.data.id
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          'token': token
        },
        success(res) {
          // console.log(res)
          if (res.data.mark == 0) {
            wx.showToast({
              title: '取消关注',
              icon: 'none',
              duration: 600
            })
            that.setData({
              guanZhu: 1
            })
          }
        }
      })
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/merchants/focus',
        method: 'post',
        data: {
          "focus_state": 0,
          "merchants_id": that.data.id
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          'token': token
        },
        success(res) {
          // console.log(res)
          if (res.data.mark == 0) {
            wx.showToast({
              title: '关注成功',
              icon: 'success',
              duration: 600
            })
            that.setData({
              guanZhu: 0
            })
          }
        }
      })
    }
  },
  //获取店铺信息
  getStoreAuthentication(id) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/searchMerchantsInfo',
      method: 'post',
      data: {
        merchants_id: id * 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded', //此处传参为query格式
        "client": 1,
        "token": token
      },
      success(res) {
        // console.log(res)
        that.setData({
          detail: res.data.data,
          guanZhu: res.data.data.focus_state
        })
      }
    })
  }
})