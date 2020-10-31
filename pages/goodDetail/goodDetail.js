//index.js
//获取应用实例
const app = getApp()
var wtim = require('../../utils/tim.js')
Page({
  onShareAppMessage(res) {
    // console.log(res)
    var that = this;
    var userdata = wx.getStorageSync('user_data');
    return {
      title: userdata.nick_name + ' 向你推荐【甄宝气】',
      imageUrl: that.data.imgUrls[0],
      path: '/pages/goodDetail/goodDetail?id=' + that.data.id+'&inviteCode='+userdata.user_id,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功'
        })
        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  data: {
    id: 0,
    shoucang: 1,
    buyNum: 1,
    detail: {}, //商品详情
    imgUrls: [],
    autoPlay: true, //默认轮播图自动轮播
    storeDetail: {}, //店铺详情
    up: false,
    inventory: 0, //商品可购买数量
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      id: options.id,
      detail:options.detail,
    })
    if (options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode)
    }
    this.getDetail(options.id)
  },
  //点击播放
  goPlay() {
    this.setData({
      autoPlay: false
    })
  },
  //暂停/播放完毕
  outPlay() {
    this.setData({
      autoPlay: true
    })
  },
  //购买数量
  handleChange({
    detail
  }) {
    if (detail.value == 0) {
      this.setData({
        buyNum: 1
      })
    } else {
      this.setData({
        buyNum: detail.value
      })
    }
  },
  UP() {
    var that = this;
    if (that.data.detail.inventory == 0) {
      wx.showToast({
        title: '当前商品无库存',
        icon: 'none',
        duration: 600
      })
    } else if (that.data.detail.state == 1) {
      wx.showToast({
        title: '商品不存在或已下架',
        icon: 'none',
        duration: 800
      })
    } else {
      that.setData({
        up: true
      })
    }
  },
  UPOff() {
    this.setData({
      up: false
    })
  },
  //展示图片
  showImg(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.imgurl, // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
    })
  },
  //去订单页
  goDetail(e) {
    var that = this;
    that.setData({
      up: false
    })
    wx.navigateTo({
      url: '../onOrder/onOrder?id=' + that.data.id + '&buyNum=' + that.data.buyNum + '&goodImg=' + that.data.imgUrls[0] + '&price=' + that.data.detail.goods_amount + '&goodName=' + that.data.detail.goods_name + '&youfei=' + that.data.detail.goods_freight
    })

  },
  //去商铺详情
  goStore() {
    wx.navigateTo({
      url: '../store/store?id=' + this.data.detail.merchants_id
    })
  },
  //去客服私信页
  gosixin() {
    var storeimg = encodeURIComponent(this.data.storeDetail.head_img);
    wx.navigateTo({
      url: '../sixin/sixin?type=1&storeimg=' + storeimg + '&to=' + this.data.storeDetail.user_id
    })
  },
  //去珍品保证
  goBaoZheng() {
    wx.navigateTo({
      url: '../../packageTab1/pages/zhenpinbaozheng/zhenpinbaozheng'
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
  //获取商品详情信息
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
        if (res.data.mark == 500) {
          wx.showToast({
            title: res.data.tip,
            icon: 'none'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login',
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
          if (res.data.mark == '1') {
            wx.showToast({
              title: res.data.tip,
              icon: 'none'
            })
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
              imgUrls = datas.goods_img.split(',');
              that.setData({
                imgUrls: imgUrls
              })
            }
            // if (datas.is_restriction == 0) {
            //   that.setData({
            //     inventory: 1
            //   })
            // } else {
            //   that.setData({
            //     inventory: datas.inventory
            //   })
            // }
            that.setData({
              detail: datas,
              shoucang: datas.collection_state,
              storeDetail: datass
            })
            wx.setStorageSync('goodDetail', res.data.data)
            wtim.login();
          }
        }
      }
    })
  },
})