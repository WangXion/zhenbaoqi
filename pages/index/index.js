const app = getApp()
var tim = require('../../utils/tim.js')
Page({
  data: {
    current: 'tab2',
    guanZhu: false,
    tuiJian: true,
    guanZhus: 'false',
    live: false,
    values: "",
    id: 0,
    imgUrls: [], //banner轮播图
    live_list: [
      "http://img4.imgtn.bdimg.com/it/u=2250800750,2031167450&fm=26&gp=0.jpg",
      "http://img4.imgtn.bdimg.com/it/u=2250800750,2031167450&fm=26&gp=0.jpg",
      "http://img4.imgtn.bdimg.com/it/u=2250800750,2031167450&fm=26&gp=0.jpg",
      "http://img4.imgtn.bdimg.com/it/u=2250800750,2031167450&fm=26&gp=0.jpg",
      "http://img4.imgtn.bdimg.com/it/u=2250800750,2031167450&fm=26&gp=0.jpg"
    ],
    storeList: [],
    ip: '',



    message: '../../static/images/messageIng.png',
    couponCanGet: true,
    page: 1,
    hotRecommend: []

  },
  onLoad() {
    this.setData({
      page: 1,
      hotRecommend: []
    })
    getHotRecommend(1, this);

    this.getBanner();

  },
  onShow() {
    this.getNewUser();
    if (wx.getStorageSync('token')) {
      this.getUserSig()
    }
    if (wx.getStorageSync('userSig')) {
      tim.login()
    }
  },
  //选项栏
  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    })
    if (detail.key == 'tab1') {
      this.setData({
        guanZhu: true,
        tuiJian: false,
        live: false
      })
      this.getQualityStore()
    } else if (detail.key == 'tab2') {
      this.setData({
        guanZhu: false,
        tuiJian: true,
        live: false
      })
    } else if (detail.key == 'tab3') {
      this.setData({
        guanZhu: false,
        tuiJian: false,
        live: true
      })
    }
  },
  //去搜索页
  goSearch() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '您需要登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '../login/login'
        })
      }, 2000)
    } else {
      wx.navigateTo({
        url: '../search/search'
      })
    }
  },
  //去珍品规则
  goZPGZ() {
    wx.navigateTo({
      url: '../../packageTab1/pages/zhenpinbaozheng/zhenpinbaozheng'
    })

  },
  //去商铺列表
  goStoreList() {
    wx.navigateTo({
      url: '../shoucang/shoucang'
    })
  },
  //更多直播
  goLive() {
    this.setData({
      guanZhu: false,
      tuiJian: false,
      live: true,
      current: 'tab3'
    })
  },
  guanzhus() {
    if (this.data.guanZhus == 'false') {
      this.setData({
        guanZhus: "true"
      })
    } else {
      this.setData({
        guanZhus: "false"
      })
    }
  },
  //查看消息
  goMSG() {
    wx.switchTab({
      url: '../message/message'
    })
  },
  //去珍品专场
  goZhenping() {
    wx.navigateTo({
      url: '../../packageTab1/pages/zpzc/zpzc'
    })
  },
  //去捡漏
  goJianLou() {
    wx.navigateTo({
      url: '../../packageTab1/pages/yyjl/yyjl'
    })
  },
  //去商品详情
  goGoodDetail(e) {
    // console.log(e)
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    })
    // if (e.currentTarget.dataset.id.type == 1) {
    //   wx.navigateTo({
    //     url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    //   })
    //   // } else {
    //   //   wx.navigateTo({
    //   //     url: '../jiluDetail/jiluDetail?id=' + e.currentTarget.dataset.id
    //   //   })
    // }
  },
  //去邀请推荐
  goxinren() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../packageTab1/pages/xinrenfuli/xinrenfuli'
      })
    }

  },
  //去珍品特卖
  goZPTM() {
    wx.navigateTo({
      url: '../../packageTab1/pages/zptm/zptm'
    })
  },
  //去店铺详情
  gostore(e) {
    wx.navigateTo({
      url: '../store/store?id=' + e.currentTarget.dataset.storeid
    })
  },
  //去鉴宝
  goZhangyan() {

  },
  //去0元起p
  goLYQP() {
    wx.navigateTo({
      url: '../../packageTab1/pages/lyqp/lyqp'
    })
  },
  //关闭新人优惠卷弹窗
  offCouponCanGet() {
    this.setData({
      couponCanGet: false
    })
  },

  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page = that.data.page + 1;
    getHotRecommend(that.data.page, that);
    wx.hideLoading();
  },
  //是否有资格领取新人优惠卷
  getNewUser() {
    var that = this;
    if (wx.getStorageSync('token')) {
      var token = wx.getStorageSync('token');
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/welfare/couponCanGet',
        method: 'post',
        data: {},
        header: {
          "client": 1,
          token: token
        },
        dataType: "json",
        success(res) {
          // console.log(res)
          if (res.data.mark == 500) {
            that.setData({
              couponCanGet: true
            })
          } else if (res.data.data.isCan == 0) {
            that.setData({
              couponCanGet: true
            })
            wx.setStorageSync('isCan', 0)
          } else if (res.data.data.isCan == 1) {
            that.setData({
              couponCanGet: false
            })
            wx.setStorageSync('isCan', 1)
          }
        }
      })
    } else {
      that.setData({
        couponCanGet: true
      })
    }

  },
  //去领取优惠卷
  goYouhui() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/welfare/couponCanGet',
      method: 'post',
      data: {},
      header: {
        "client": 1,
        token: token
      },
      dataType: "json",
      success(res) {
        // console.log(res)
        if (res.data.mark == 500) {
          wx.showToast({
            title: '您需要登录',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 2000)
        } else if (res.data.data.isCan == 0) {
          that.setData({
            couponCanGet: false
          })
          wx.navigateTo({
            url: '../../packageTab1/pages/xinrenfuli/xinrenfuli'
          })
        } else if (res.data.data.isCan == 1) {
          that.setData({
            couponCanGet: false
          })
        }
      }
    })
  },
  //获取聊天sig
  getUserSig() {
    var that = this;
    if (!wx.getStorageSync('token')) {} else {
      var token = wx.getStorageSync('token');
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/chat/userSig',
        method: 'post',
        data: {},
        header: {
          "client": 1,
          token: token
        },
        dataType: "json",
        success(res) {
          if (res.data.mark == 0) {
            wx.setStorageSync('userSig', res.data.usersig)
            tim.login()
          }

        }
      })
    }
  },
  //获取优选店铺
  getQualityStore() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/optMerchants',
      method: 'post',
      data: {},
      header: {
        "client": 1,
        token: token
      },
      dataType: "json",
      success(res) {
        // console.log(res)
        that.setData({
          storeList: res.data.data
        })
      }
    })
  },
  //关注优店
  focusStore(e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var storeList = that.data.storeList;
    if (e.currentTarget.dataset.focus == 0) {
      wx.navigateTo({
        url: '../store/store?id=' + e.currentTarget.dataset.storeid
      })
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/merchants/focus',
        method: 'post',
        data: {
          "focus_state": 0,
          "merchants_id": e.currentTarget.dataset.storeid
        },
        header: {
          "client": 1,
          token: token
        },
        dataType: "json",
        success(res) {
          if (res.data.mark == 0) {
            wx.showToast({
              title: '关注成功',
              icon: 'success',
              duration: 2000
            })
            for (var i = 0; i < storeList.length; i++) {
              if (storeList[i].merchants_id == e.currentTarget.dataset.storeid) {
                storeList[i].is_focus = 0
              }
            }
            that.setData({
              storeList: storeList
            })
          }
        }
      })
    }
  },
  //获取banner
  getBanner() {
    var that = this;
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/banner/bannerList',
      method: 'post',
      data: {},
      header: {
        "client": 1,
        token: '620b01fe-2aec-4bde-a1da-439d08eb59d9'
      },
      dataType: "json",
      success(res) {
        // console.log(res)
        that.setData({
          imgUrls: res.data.list
        })
      }
    })
  },
  //点击banner
  goBanner(e) {
    var path = encodeURIComponent(e.currentTarget.dataset.url);
    wx.navigateTo({
      url: '../web_page/web_page' + '?path=' + path
    })
  },
})
//获取热门推荐
function getHotRecommend(page, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/goods/hot/list',
    method: 'post',
    data: {
      "current_page": page,
      "page_size": 10
    },
    header: {
      "client": 1,
      token: token
    },
    dataType: "json",
    success(res) {
      // console.log(res)
      if (res.data.data == null) {
        that.setData({
          hotRecommend: that.data.hotRecommend
        })
      } else if (res.data.data.length == 0) {
        that.setData({
          hotRecommend: that.data.hotRecommend
        })
      }
      if (res.data.mark == 0) {
        var hotRecommends = that.data.hotRecommend;
        var list = res.data.data;
        for (var i = 0; i < list.length; i++) {
          if (list[i].goods_img.indexOf(',') == -1) {} else {
            var imgUrl = list[i].goods_img.split(',');
            list[i].goods_img = imgUrl[0];
          }
        }
        that.setData({
          hotRecommend: hotRecommends.concat(list)
        })
      } else {
        that.setData({
          hotRecommend: []
        })
      }
    }
  })
}