const app = getApp()

Page({
  data: {
    current: 'tab1',
    state: 0,
    page: 1,
    lists: []
  },
  onLoad(options) {
    this.setData({
      lists: [],
      page: 1,
      current: options.state,
      state: options.num
    })
  },
  onShow() {
    this.setData({
      lists: [],
      page: 1,
    })
    getproinfo(1, this, this.data.state);
  },
  //触底加载
  onReachBottom() {
    var mythis = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    mythis.data.page = mythis.data.page + 1;
    getproinfo(mythis.data.page, mythis, mythis.data.state);
    wx.hideLoading();
  },
  //选项栏
  handleChange({
    detail
  }) {
    var mythis = this;
    mythis.setData({
      current: detail.key
    });
    if (detail.key == 'tab1') {
      mythis.setData({
        state: 0,
        page: 1,
        lists: []
      })
      getproinfo(mythis.data.page, mythis, mythis.data.state);
    } else if (detail.key == 'tab2') {
      mythis.setData({
        state: 1,
        page: 1,
        lists: []
      })
      getproinfo(mythis.data.page, mythis, mythis.data.state);
    } else if (detail.key == 'tab3') {
      mythis.setData({
        state: 2,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab4') {
      mythis.setData({
        state: 3,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab5') {
      mythis.setData({
        state: 4,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab6') {
      mythis.setData({
        state: 5,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab7') {
      mythis.setData({
        state: 6,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab8') {
      mythis.setData({
        state: 7,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab9') {
      mythis.setData({
        state: 8,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab10') {
      mythis.setData({
        state: 9,
        page: 1,
        lists: []
      })
    }
    getproinfo(mythis.data.page, mythis, mythis.data.state);
  },
  //去售后
  goSh(e) {
    wx.navigateTo({
      url: '../afterSale/afterSale'
    })
  },
  //去物流页
  gologistics(e) {
    wx.navigateTo({
      url: '../logistics/logistics?id=' + e.currentTarget.dataset.ordernum
    })
  },
  //去订单详情页
  goDetail(e) {
    //  console.log(e)
    wx.navigateTo({
      url: '../cardDetail/cardDetail?ordernum=' + e.currentTarget.dataset.ordernum + '&remark=' + e.currentTarget.dataset.remark
    })
  },
  //去评价
  goevaluate() {
    wx.navigateTo({
      url: '../evaluate/evaluate'
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
  //再次购买
  goGoodDetail(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    })
  },
  //删除订单
  detateCard(e) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/delOrder',
      method: 'post',
      data: {
        order_number: e.currentTarget.dataset.ordernum,
        remark: e.currentTarget.dataset.remark
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        //console.log(res)
        if (res.data.mark == 0) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            lists: [],
            page: 1,
          })
          getproinfo(1, that, that.data.state);
        }
      }
    })
  }
})
// _____________________________________________________________________________________
//加载
function getproinfo(page, that, state) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/user/order/list',
    method: 'post',
    data: {
      page_size: 10,
      state: state,
      current_page: page
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      'token': token
    },
    success(res) {
      console.log(res)
      var listss = res.data.list;
      var lists = that.data.lists;
      if (listss == null) {
        that.setData({
          lists: lists
        })
      } else if (listss.length == 0) {
        that.setData({
          lists: lists
        })
      } else {
        for (var i = 0; i < listss.length; i++) {
          if (listss[i].goods_img.indexOf(',') == -1) {
            var lists = that.data.lists
            lists.push(listss[i])
            that.setData({
              lists: lists
            })
          } else {
            var imgUrls = listss[i].goods_img.split(',');
            listss[i].goods_img = imgUrls[0]
            var lists = that.data.lists;
            lists.push(listss[i])
            that.setData({
              lists: lists
            })
          }
        }
      }
    },
    fail(res) {
      console.log(res);
    }
  });
}