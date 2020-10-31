//index.js
//获取应用实例
const app = getApp()
var wtim = require('../../utils/tim.js')
Page({
  data: {
    id: 0, //商铺id
    detail: {}, //店铺所有信息
    guanZhu: 1, //0为已关注
    evaluate: [], //评价列表
    pingjiaNUm: 2100,
    current: 'tab1',
    goods: [], //商品列表
    page: 1,
    inviteCode: 0, //邀请码
    userid: 0
  },
  onLoad(options) {
    this.setData({
      id: options.id,
    })
    if (options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode)
    }
       this.getStoreDetail(options.id);
    this.getStoreEvaluate(options.id)
  },
  onShow() {
    this.setData({
      page: 1,
      goods: []
    })
    getStoreGoods(1, 0, this.data.id, this)
  },
  //选项栏
  handleChange({
    detail
  }) {
    var that = this;
    that.setData({
      current: detail.key
    })
    if (detail.key == 'tab1') {
      that.setData({
        page: 1,
        goods: []
      })
      // getStoreGoods(1, 1, that.data.id, that)
    } else {
      that.setData({
        page: 1,
        goods: []
      })
      // getStoreGoods(1, 0, that.data.id, that)
    }
  },
  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page = that.data.page + 1;
    // if (that.data.current == 'tab1') {
    //   getStoreGoods(page, 1, that.data.id, that)
    // } else {
    //   getStoreGoods(page, 0, that.data.id, that)
    // }
    getStoreGoods(that.data.page, 0, that.data.id, that)
    wx.hideLoading();
  },
  //获取店铺信息
  getStoreDetail(id) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.setStorageSync('conversationid', 'C2C' + id);
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
        if (res.data.mark == 500) {
          wx.showToast({
            title: res.data.tip,
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
            detail: res.data.data,
            guanZhu: res.data.data.focus_state,
            userid: res.data.data.user_id
          })
          wtim.login();
        }
      }
    })
  },

  //获取商户评价信息
  getStoreEvaluate(id) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/searchMerchantsEvaluationInfo',
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
       console.log(res)
        if(res.data.data<=6){
          that.setData({
            evaluate: res.data.data
          })
        }
      }
    })
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
  //去商品详情
  goDetail(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    })
  },
  //去客服
  goSixin() {
    var storeimg = encodeURIComponent(this.data.detail.head_img);
    wx.navigateTo({
      url: '../sixin/sixin?type=2&storeimg=' + storeimg + '&to=' + this.data.userid
    })
  },
  //去评价页
  goPingjia() {
    if (this.data.evaluate.length == 0) {
      return
    } else {
      wx.navigateTo({
        url: '../storeeValuate/storeeValuate'
      })
    }
  },
  //回到首页
  goIndex() {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  //去认证信息
  goStoreAuthentication() {
    wx.navigateTo({
      url: '../../packageTab1/pages/attestation/attestation?id=' + this.data.id
    })
  }
})
//获取商店商品列表
function getStoreGoods(page, type, id, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/merchants/goods/storeList',
    method: 'post',
    data: {
      "current_page": page,
      "merchants_id": id,
      "page_size": 10,
      "type": type
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      "token": token
    },
    success(res) {
      // console.log(res)
      if (res.data.list == null) {
        that.setData({
          goods: that.data.goods
        })
      } else if (res.data.list.length == 0) {
        that.setData({
          goods: that.data.goods
        })
      } else {
        if (res.data.mark == 0) {
          var goods = that.data.goods;
          var list = res.data.list;
          for (var i = 0; i < list.length; i++) {
            if (list[i].goods_img.indexOf('1') == -1) {} else {
              var imgUrl = list[i].goods_img.split(',');
              list[i].goods_img = imgUrl[0]
            }
          }
          that.setData({
            goods: goods.concat(list)
          })
        }
      }
    }
  })
}