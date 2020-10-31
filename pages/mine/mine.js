const app = getApp()

Page({
  data: {
    user_lv: {},
    user_data: {},
    user_type: 1,
    message: '../../static/images/messageIng.png',
    balance: 0,
    coupon_number: 0,
    gold: 0,
    point: 0,
    state: 0, //0为未登录，1为登录

  },
  onLoad() {},
  onShow() {
    if (!wx.getStorageSync('token')) {
      this.setData({
        state: 0
      })
    } else {
      var user_data = wx.getStorageSync('user_data');
      this.setData({
        state: 1,
        user_data: user_data
      })
      this.getUserAccount();
      this.getUserLV();
      this.getUserStore();
    }
  },
  //点击登录
  goLogin() {
    if (this.data.state == 0) {
      wx.reLaunch({
        url: '../login/login'
      })
    }
  },
  //去修改用户信息
  goUserSet() {
    if (this.data.state == 0) {
      wx.reLaunch({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: '../userSet/userSet'
      })
    }
  },
  //去参p记录
  goJilu() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../jilu/jilu'
      })
    }
  },
  //去收藏
  goSC() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../shoucang/shoucang'
      })
    }
  },
  //去余额
  goYue() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../yue/yue'
      })
    }
  },
  //去优惠卷
  goYH() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../packageTab1/pages/youhui/youhui'
      })
    }
  },
  //下载APP
  goDownAPP() {
    wx.navigateTo({
      url: '../../packageTab1/pages/downAPP/downAPP'
    })
  },
  //去订单页
  goCard(e) {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      var state = e.currentTarget.dataset.state; //根据state选择订单页首先显示什么
      var num = e.currentTarget.dataset.num;
      wx.navigateTo({
        url: '../card/card' + '?state=' + state + '&num=' + num
      })
    }
  },
  //去实名认证
  goAuthentication() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../authentication/authentication'
      })
    }

  },
  //收货地址
  goSite() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../site/site'
      })
    }
  },
  //成为商家
  merchant() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (this.data.user_type == 1) {
        wx.navigateTo({
          url: '../../packageTab1/pages/merchant/merchant'
        })
      } else {
        wx.navigateTo({
          url: '../../packageTab1/pages/tuijian/tuijian'
        })
      }
    }
  },
  //客服
  goKefu() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../kefu/kefu'
      })
    }
  },
  //帮助
  goHelp() {
    wx.navigateTo({
      url: '../help/help'
    })
  },
  //推荐
  goTuij() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../packageTab1/pages/tuijian/tuijian'
      })
    }
  },
  //意见反馈
  goOpinion() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../opinion/opinion'
      })
    }
  },
  //设置
  goSetting() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../setting/setting'
      })
    }

  },
  //去等级页
  goLv() {
    if (this.data.state == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../packageTab1/pages/lv/lv'
      })
    }

  },
  //查看消息
  goMSG() {
    wx.switchTab({
      url: '../message/message'
    })
  },
  //获取商户信息
  getUserStore() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/merchantsinfo',
      method: 'post',
      data: {

      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success: res => {
        if (res.data.tip == "需要登录") {
          wx.showToast({
            title: '登录失效',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 1000)
        } else if (res.data.mark == 501) {
          wx.showToast({
            title: '未绑定手机号',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../changePw/changePw?state=1'
            })
          }, 1000)
        } else {
          that.setData({
            user_type: res.data.user_type
          })
        }
      }
    })
  },
  //获取用户等级
  getUserLV() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //获取用户等级
      url: 'https://www.zbq888.cn/api/v1/welfare/userGrade',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success: res => {
        // console.log(res)
        if (res.data.mark == 500) {
          wx.showToast({
            title: '登录失效',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 1000)
        } else if (res.data.mark == 501) {
          wx.showToast({
            title: '未绑定手机号',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../changePw/changePw?state=1'
            })
          }, 1000)
        } else {
          wx.setStorageSync('user_lv', res.data.data);
          that.setData({
            user_lv: res.data.data
          })
        }
      }
    })
  },
  //获取用户账户信息
  getUserAccount() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/baseinfo',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success: res => {
        // console.log(res)
        if (res.data.tip == "需要登录") {
          wx.showToast({
            title: '登录失效',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 1000)
        } else if (res.data.mark == 501) {
          wx.showToast({
            title: '未绑定手机号',
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../changePw/changePw?state=1'
            })
          }, 1000)
        } else {
          wx.setStorageSync('user_lv', res.data.data);
          that.setData({
            balance: res.data.data.balance,
            coupon_number: res.data.data.coupon_number,
            gold: res.data.data.gold,
            point: res.data.data.point
          })
        }
      }
    })
  },
})