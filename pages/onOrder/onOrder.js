const app = getApp()
const utilMd5 = require('../../utils/md5');
Page({
  data: {
    goods: [1], //购买的商品
    pays: false, //支付弹窗
    money: 0, //商品金额
    id: 0, //商品id
    remark: '', //买家备注
    payType: 1, //支付类型（1微信，2余额）
    buyNum: 1, //购买数量
    good_img: '', //商品图片地址
    good_price: 0, //商品单价
    good_name: '', //商品名称
    discounts: 0, //优惠金额,
    discountsId: 0, //优惠卷id
    discountsList: [], //优惠卷列表
    selectdiscounts: false, //优惠卷
    switch1Checked: true, //鉴甄宝服务
    jianZhenM: 40, //鉴甄宝价钱
    youfei: 0, //是否包邮
    site: { //发货地址
      site_id: -100,
      site_name: '',
      site_phone: '',
      site_detail: '',
    },
    goPay:true,//支付订单
  },
  onLoad(options) {
    if (options.youfei == 0) {
      this.setData({
        youfei: 0,
      })
    } else {
      this.setData({
        youfei: 5,
      })
    }
    this.setData({
      id: options.id,
      buyNum: options.buyNum,
      good_img: options.goodImg,
      state: 1,
      good_name: options.goodName,
      good_price: options.price / 100,
      site: {
        site_id: -100,
        site_name: '',
        site_phone: '',
        site_detail: '',
      },
    })
  },
  onShow() {
    var that = this;
    if (wx.getStorageSync('cardSite')) {
      var siteData = wx.getStorageSync('cardSite');
      if (siteData.adsId) {
        var sites = {
          site_id: siteData.adsId,
          site_name: siteData.name,
          site_phone: siteData.phone,
          site_detail: siteData.sitename + siteData.address + '',
        }
        that.setData({
          site: sites
        })
      } else {
        var sites = {
          site_id: -100,
          site_name: '',
          site_phone: '',
          site_detail: '',
        }
        that.setData({
          site: sites
        })
      }
    } else {
      var sites = {
        site_id: -100,
        site_name: '',
        site_phone: '',
        site_detail: '',
      }
      that.setData({
        site: sites
      })
    }
    this.getDiscountsList();
  },
  //去地址页
  goSite() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../site/site?type=card1'
      })
    }
  },
  //支付弹窗关闭开启
  PayOff() {
    if (this.data.pays == false) {
      this.setData({
        pays: true,
        payType: 1,
        goPay:false
      })
    } else {
      this.setData({
        pays: false,
        payType: 1,
        goPay:true
      })
    }
  },
  //优惠券弹窗（弹起/隐藏）
  selectDiscountsTab() {
    var that =this;
    if (that.data.discountsList.length == 0) {} else {
      if (that.data.selectdiscounts == false) {
        that.setData({
          selectdiscounts: true,
          goPay:false
        })
      } else {
        that.setData({
          selectdiscounts: false,
          goPay:true
        })
      }
    }
  },
  //鉴甄宝服务开关
  switch1Change(e) {
    var switchs = e.detail.value;
    if (switchs == false) {
      this.setData({
        jianZhenM: 0
      })
    } else {
      this.setData({
        jianZhenM: 40
      })
    }
  },
  //选择优惠卷
  selectDiscounts(e) {
    this.setData({
      selectdiscounts:false,
      goPay:true,
      discountsId: e.currentTarget.dataset.couponsid,
      discounts: e.currentTarget.dataset.couponsamount,
    })
  },
  //选择支付方式
  radioChange(e) {
    console.log(e)
    var that = this;
    if (e.detail.value == 'wx') {
      that.setData({
        payType: 4,
      })
    } else {
      that.setData({
        payType: 5
      })
    }
  },
  //获取可用优惠卷
  getDiscountsList() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({ //小程序支付
      url: 'https://www.zbq888.cn/api/v1/coupons/available/list',
      method: 'post',
      data: {
        goods_id: that.data.id
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
            discountsList: [],
            discountsId:0
          })
        } else if (res.data.list.length == 0) {
          that.setData({
            discountsList: [],
            discountsId:0
          })
        } else {
          that.setData({
            discountsList: res.data.list
          })
        }
      }
    })
  },
  //支付
  goStatus() {
    var that = this;
    var token = wx.getStorageSync('token');
    if (that.data.payType == 5) {
      wx.showToast({
        title: '暂不支持此功能',
        icon: 'none'
      })
      return
    } else if (that.data.payType == 4) {
      console.log(that.data.payType)
      wx.request({ //小程序支付
        url: 'https://www.zbq888.cn/api/v1/user/order/insert',
        method: 'post',
        data: {
          "ads_id": that.data.site.site_id,
          "coupons_id": that.data.discountsId,
          "goods_id": that.data.id,
          "pay_type": that.data.payType,
          "remark": that.data.remark,
          "treasure_amount": that.data.jianZhenM * 100,
          "pay_number": that.data.buyNum
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          "token": token
        },
        success(res) {
          console.log(res)
          if (res.data.tip == '地址不存在') {
            wx.showToast({
              title: '请选择地址',
              icon: 'none'
            })
            setTimeout(() => {
              that.setData({
                pays: false,
                payType: 1
              })
              that.goSite()
            }, 600)
          } else if (res.data.mark == 1) {
            wx.showToast({
              title: res.data.tip,
              icon: 'none'
            })
            that.setData({
              pays: false
            })
          } else if (res.data.mark == 0) {
            that.setData({
              pays: false
            })
            var stringA = "appId=" + res.data.mini_appId + "&nonceStr=" + res.data.noncestr + "&package=" + res.data.mini_package + "&signType=MD5" + "&timeStamp=" + res.data.timestamp + "&key=sTuNmbuf9NVblCOsLKDig2wibJUSKEBg";
            var paySign = utilMd5.hexMD5(stringA);
            wx.requestPayment({
              timeStamp: res.data.timestamp,
              nonceStr: res.data.noncestr,
              package: res.data.mini_package,
              signType: 'MD5',
              paySign: paySign,
              appId: res.data.mini_appId,
              success(ress) {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1000,
                  mask: true
                })
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../../packageTab1/pages/payStatus/payStatus'
                  })
                }, 1000)
              },
              fail(ress) {
                if (ress.errMsg == 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '您取消了支付',
                    icon: 'none',
                    duration: 600,
                    mask: true
                  })
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '../card/card'
                    })
                  }, 800)
                }
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      })
      return
    }
  },
  //买家留言
  textareas(e) {
    // console.log(e.detail.value)
    this.setData({
      remark: e.detail.value
    })
  },
  //复制订单号码
  copyNum(e) {
    var datas = e.currentTarget.dataset.name + '  ' + e.currentTarget.dataset.phone + '  ' + e.currentTarget.dataset.text
    wx.setClipboardData({
      data: datas,
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