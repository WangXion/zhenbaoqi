const app = getApp()

Page({
  data: {
    id: 0, //商品id
    shoucang: 1, //商品收藏
    up: false,
    detail: {}, //商品详情
    storeDetail: {}, //店铺详情
    imgUrls: [], // 商品轮播图
    guanzhu: 1, //店铺关注
    text_height: '150rpx',
    targetTime: 0, //截至倒计时
    lookadd: '查看更多',
    people: [], //拍卖榜
    myFormat: ['时', '分', '秒'],
    page: 1, //页数
    pageSize: 3, //数量
    clearTimer: false

  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.getDetail(options.id)
    getAuctionList(1, options.id, 3)
  },
  lookAll() {
    if (this.data.text_height == '150rpx') {
      this.setData({
        text_height: '500rpx'
      })
    } else {
      this.setData({
        text_height: '150rpx'
      })
    }
  },
  onUnload() {
    this.setData({
      clearTimer: true
    });
  },
  //查看更多
  lookAdd() {
    if (this.data.lookadd == '查看更多') {
      this.setData({
        lookadd: '收起',

      })
    }
  },
  //弹窗
  UP() {
    this.setData({
      up: true
    })
  },
  //弹窗关闭
  UPOff() {
    this.setData({
      up: false
    })
  },
  //去店铺
  goStore(e) {
    wx.navigateTo({
      url: '../store/store?id=' + e.currentTarget.dataset.id
    })
  },
  //去私信
  goSixin() {
    wx.navigateTo({
      url: '../sixin/sixin'
    })
  },
  //下单
  goDetail() {
    // wx.navigateTo({
    //   url: '../cardDetail/cardDetail?state=' + state
    // })
  },
  //去珍品保证
  goBaoZheng() {
    wx.navigateTo({
      url: '../../packageTab1/pages/zhenpinbaozheng/zhenpinbaozheng'
    })
  },
  //获取商品详情
  getDetail(id) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/goods/detail',
      method: 'post',
      data: {
        goods_id: id
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        "token": token
      },
      success(res) {
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
          var imgUrls = [];
          var datas = res.data.data.goods;
          var datass = res.data.data.merchants;
          if (datas.goods_img.indexOf(',') == -1) {
            imgUrls.push(datas.goods_img)
            that.setData({
              imgUrls: imgUrls
            })
          } else {
            var imgUrls = []
            imgUrls = datas.goods_img.split(',');
            that.setData({
              imgUrls: imgUrls
            })
          }
          var time = datas.end_time_timestamp - new Date().getTime();
          that.setData({
            detail: datas,
            shoucang: datas.collection_state,
            storeDetail: datass,
            guanzhu: datass.is_focus,
            targetTime: new Date().getTime() + time * 1
          })
        }
      }
    })
  },
  //点击收藏/取消收藏
  shouCang() {
    var that = this;
    var token = wx.getStorageSync('token');
    if (that.data.shoucang == 1) {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/goods/collection',
        method: 'post',
        data: {
          goods_id: that.data.id,
          collection_state: 0
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          "token": token
        },
        success(res) {
          // console.log(res)
          if (res.data.mark == 0) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 600
            })
            that.setData({
              shoucang: 0
            })
          } else if (res.data.mark == 1) {
            wx.showToast({
              title: '商品不存在或已下架',
              icon: 'none',
              duration: 800
            })
          }
        }
      })
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/goods/collection',
        method: 'post',
        data: {
          goods_id: that.data.id,
          collection_state: 1
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          "token": token
        },
        success(res) {
          // console.log(res)
          if (res.data.mark == 0) {
            wx.showToast({
              title: '取消收藏',
              icon: 'none',
              duration: 600
            })
            that.setData({
              shoucang: 1
            })
          } else if (res.data.mark == 1) {
            wx.showToast({
              title: '商品不存在或已下架',
              icon: 'none',
              duration: 800
            })
          }
        }
      })
    }
  },
  //店铺关注/取关
  guanzhu() {
    var that = this;
    var token = wx.getStorageSync('token');
    if (that.data.guanzhu == 0) {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/merchants/focus',
        method: 'post',
        data: {
          "focus_state": 1,
          "merchants_id": that.data.storeDetail.merchants_id
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
              guanzhu: 1
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
          "merchants_id": that.data.storeDetail.merchants_id
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
              guanzhu: 0
            })
          }
        }
      })
    }
  },
})
//获取竞拍出价列表
function getAuctionList(page, id, pagesize) {
  var that = this;
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/goods/auction/list',
    method: 'post',
    data: {
      "current_page": page,
      "goods_id": id,
      "page_size": pagesize
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      "token": token
    },
    success(res) {
      console.log(res)

    }
  })
}