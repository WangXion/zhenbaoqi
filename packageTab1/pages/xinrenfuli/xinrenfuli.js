const app = getApp()

Page({
  data: {
    list: [],
    btn_status_show: false,
    current: 'tab1',
    tab1: true,
    tab2: false,
    tabsGoods: [],
    page: 1,
    isCan: 0
  },
  onLoad() {},
  onShow() {
    var isCan = wx.getStorageSync('isCan');
    this.setData({
      tabsGoods: [],
      page: 1,
      isCan: isCan
    })
    getproinfo(1, this)
    this.getList()
  },
  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page = that.data.page + 1;
    getproinfo(that.data.page, that);
    wx.hideLoading();
  },
  //获取优惠卷列表
  getList() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/welfare/registerCouponList',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json',
        "client": 1,
        'token': token,
      },
      success: res => {
        console.log(res)
        that.setData({
          list: res.data.data
        })
      }
    })
  },
  //一键领取优惠卷
  statusShow() {
    var that = this
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/welfare/receiveCoupon',
      method: 'post',
      data: {},
      header: {
        "client": 1,
        'token': token,
      },
      success(res) {
        // console.log(res)
        if (res.data.tip == '成功') {
          that.setData({
            btn_status_show: true,
            isCan:1
          })
        } else if (res.data.mark == 1) {
          wx.showToast({
            title: '已经领取过优惠卷',
            icon: 'none',
            duration: 1500,
          })
        }
      }
    })
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
        tab1: true,
        tab2: false,
        tabsGoods: [],
        page: 1
      })
      getproinfo(that.data.page, that);
    } else if (detail.key == 'tab2') {
      that.setData({
        tab1: false,
        tab2: true,
        tabsGoods: [],
        page: 1
      })
      // getproinfo(that.data.page, that);
    }
  },
  //去优惠卷页面
  goIndex() {
    wx.navigateTo({
      url: '../youhui/youhui'
    })
  },
  goGoodDetail(e) {
    wx.navigateTo({
      url: '../../../pages/goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    })
    // if (e.currentTarget.dataset.id.type == 1) {
    //   wx.navigateTo({
    //     url: '../../../pages/goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    //   })
    // // } else {
    // //   wx.navigateTo({
    // //     url: '../jiluDetail/jiluDetail?id=' + e.currentTarget.dataset.id
    // //   })
    // }
  }
})

//加载
function getproinfo(page, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/goods/new/list',
    method: 'post',
    data: {
      page_size: 10,
      current_page: page
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      'token': token
    },
    success(res) {
      // console.log(res)
      if (res.data.list == null) {
        that.setData({
          tabsGoods: that.data.tabsGoods
        })
      } else if (res.data.list.length == 0) {
        that.setData({
          tabsGoods: that.data.tabsGoods
        })
      } else {
        var tabsGoods = that.data.tabsGoods;
        for (var i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].goods_img.indexOf(',') == -1) {
            tabsGoods.push(res.data.list[i]);
          } else {
            var imgUrls = res.data.list[i].goods_img.split(',');
            res.data.list[i].goods_img = imgUrls[0]
            tabsGoods.push(res.data.list[i]);
          }
        }
        that.setData({
          tabsGoods: tabsGoods
        })
      }


    },
    fail(res) {
      // console.log(res);
    }
  });
}