const app = getApp()
const utilMd5 = require('../../utils/md5');
Page({
  data: {
    state: '', //当前订单状态
    order_number: '', //订单号
    goods: [1], //购买的商品
    dialogShow: false, //弹窗控制
    buttons: [{ //弹窗按钮
      text: '取消'
    }, {
      text: '确定'
    }],
    pays: false, //支付弹窗
    money: '128', //商品金额
    id: 0, //商品id
    remark: '', //买家备注
    payType: 1, //支付类型（1微信，2余额）
    buyNum: 1, //购买数量
    good_img: '', //商品图片地址
    good_price: 0, //商品单价
    good_name: '', //商品名称
    discounts: 0, //优惠
    site: { //发货地址
      site_id: -100,
      site_name: '',
      site_phone: '',
      site_detail: '',
    },
    order_time: '', //下单时间
    pay_time: '', //支付时间,
    cancel_time: '', //取消时间
    delivery_time: '', //发货时间
    evaluation_time: '', //评价时间
    receiving_time: "", //签收时间
    refund_time: '', //退款时间
  },
  onLoad(options) {
    this.setData({
      order_number: options.ordernum,
      remark:options.remark
    })
    this.getCardDetail(options.ordernum)
  },
  onShow() {

  },
  //去售后
  goShouHou() {
    wx.navigateTo({
      url: '../afterSale/afterSale?name=' + this.data.site.site_name + '&phone=' + this.data.site.site_phone + '&order_number=' + this.data.order_number
    })
  },
  //去售后结果
  goStatus() {
    wx.navigateTo({
      url: '../saleStatus/saleStatus?order_number=' + this.data.order_number
    })
  },
  //私信客服
  gosixin() {
    wx.navigateTo({
      url: '../sixin/sixin'
    })
  },
  //去物流页
  gologistics() {
    wx.navigateTo({
      url: '../logistics/logistics?id=' + this.data.order_number
    })
  },
  //去评价
  goevaluate() {
    wx.navigateTo({
      url: '../evaluate/evaluate'
    })
  },
  //确认收货
  goOn() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/order/receiving',
      method: 'post',
      data: {
        order_number: that.data.order_number,
        remark:that.data.remark
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: '确认收货'
        })
        that.getCardDetail(that.data.order_number)
      }
    })
  },
  //取消订单
  openConfirm() {
    this.setData({
      dialogShow: true
    })
  },
  //确认取消订单？
  tapDialogButton(e) {
    var that = this;
    var token = wx.getStorageSync('token');
    this.setData({
      dialogShow: false
    })
    if (e.detail.index == 1) {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/order/cancel',
        method: 'post',
        data: {
          order_number: that.data.order_number
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          'token': token
        },
        success(res) {
          console.log(res)
          wx.showToast({
            title: '取消订单成功'
          })
          that.getCardDetail(that.data.order_number)
        }
      })
    }
  },

  //选择支付方式
  radioChange(e) {
    var that = this;
    if (e.detail.value == 'wx') {
      that.setData({
        payType: 4
      })
    } else {
      that.setData({
        payType: 5
      })
    }
  },
  //支付弹窗
  goZhifu() {
    var that = this;
    that.setData({
      pays: true
    })
  },
  //支付弹窗关闭开启
  PayOff() {
    if (this.data.pays == false) {
      this.setData({
        pays: true,
        payType: 1
      })
    } else {
      this.setData({
        pays: false,
        payType: 1
      })
    }
  },
  //待付款下单支付
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
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/order/waitinsert',
        method: 'post',
        data: {
          order_number: that.data.order_number
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          'token': token
        },
        success(res) {
          console.log(res)
          if (res.data.tip == '库存不足') {
            wx.showToast({
              title: '当前商品库存不足',
              icon: 'none'
            })
          } else {
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
                    duration: 1000,
                    mask: true
                  })
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '../card/card'
                    })
                  }, 1000)
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
  //获取订单信息（从订单列表页进来）
  getCardDetail(orderNum) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/order/detail',
      method: 'post',
      data: {
        order_number: orderNum
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        console.log(res)
        if (res.data.goods_img.indexOf(',') == -1) { //判断获取的图片地址时一个还是多个的字符串
          that.setData({
            good_img: res.data.goods_img,
          })
        } else {
          var eidx = res.data.goods_img.indexOf(',');
          var imgUrl1 = res.data.goods_img.substring(0, eidx)
          that.setData({
            good_img: imgUrl1
          })
        }
        function formatDate(now) { // 对获取到的字符串转换
          var year = now.getFullYear(); //取得4位数的年份
          var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
          var date = now.getDate(); //返回日期月份中的天数（1到31）
          var hour = now.getHours(); //返回日期中的小时数（0到23）
          var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
          var second = now.getSeconds(); //返回日期中的秒数（0到59）
          return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
        var order_times = formatDate(new Date(res.data.order_time * 1));
        var pay_times = formatDate(new Date(res.data.pay_time * 1));
        var cancel_times = formatDate(new Date(res.data.cancel_time * 1));
        var delivery_times = formatDate(new Date(res.data.delivery_time * 1));
        var receiving_times = formatDate(new Date(res.data.receiving_time * 1));
        var evaluation_times = formatDate(new Date(res.data.evaluation_time * 1));
        var refund_times = formatDate(new Date(res.data.refund_time * 1));

        that.setData({
          id: res.data.goods_id, //商品id
          state: res.data.state, //订单状态
          good_name: res.data.goods_name, //商品名
          good_price: res.data.order_amount / 100, //商品单价
          discounts: res.data.coupons_amount / 100, //优惠金额
          cancel_time: res.data.cancel_time, //取消时间
          order_time: order_times, //下单时间
          pay_time: pay_times, //支付时间,
          cancel_time: cancel_times, //取消时间
          delivery_time: delivery_times, //发货时间
          evaluation_time: evaluation_times, //评价时间
          receiving_time: receiving_times, //签收时间
          refund_time: refund_times, //退款时间
          youfei: res.data.courier_amount * 1, //邮费
          site: { //订单地址
            site_id: 0,
            site_name: res.data.consignee,
            site_phone: res.data.phone_no,
            site_detail: res.data.address,
          },
        })
      }
    })
  },
  //提醒发货
  tixing() {
    wx.showToast({
      title: '已提醒卖家发货',
      icon: 'success',
      duration: 1000
    })
  },
  //再次购买/查看商品详情
  goGoodDetail() {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + this.data.id
    })
  },
  //复制订单号码
  copyNum(e) {
    console.log(e)
    var datas = e.currentTarget.dataset.name +' ' + e.currentTarget.dataset.phone 
    + ' ' + e.currentTarget.dataset.text
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