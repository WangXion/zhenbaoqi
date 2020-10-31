const app = getApp()

Page({
  data: {
    current: 'tab1',
    goods: true,
    store: false,
    lists: [],
    page: 1,
  },
  onLoad() {},
  onShow() {
    this.setData({
      page: 1,
      lists: [],
    })
    if (this.data.current == 'tab1') {
      getproinfo(1, this);
    } else {
      getStore(1, this)
    }
  },
  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page= that.data.page + 1;
    if (that.data.current == 'tab1') {
      getproinfo(that.data.page, that);
    } else {
      getStore(that.data.page, that)
    }
    wx.hideLoading();
  },
  handleChange({
    detail
  }) {
    var that = this;
    that.setData({
      current: detail.key,
    })
    if (detail.key == 'tab1') {
      that.setData({
        goods: true,
        store: false,
        lists: [],
        page: 1
      })
      getproinfo(1, that);
    } else if (detail.key == 'tab2') {
      that.setData({
        goods: false,
        store: true,
        lists: [],
        page: 1
      })
      getStore(1, that)
    }
  },
  //去商品详情
  goGoodDetail(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.goodid
    })
  },
  //去店铺详情
  goStoreDetail(e) {
    wx.navigateTo({
      url: '../store/store?id=' + e.currentTarget.dataset.storeid
    })
  }
})
//加载关注商品
function getproinfo(page, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/user/goods/collection/list',
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
      var list = res.data.list
      for (var i = 0; i < list.length; i++) { //// 对商品图片地址进行处理
        if (list[i].goods_img.indexOf(',') == -1) {
          var lists = that.data.lists;
          lists.push(list[i])
        } else {
          var imgUrls = list[i].goods_img.split(',');
          list[i].goods_img = imgUrls[0];
          var lists = that.data.lists;
          lists.push(list[i]);
        }
      }
      that.setData({
        lists: lists
      })
    },
    fail(res) {
      console.log(res);
    }
  });
}
//加载关注店铺
function getStore(page, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/user/merchants/focus/list',
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
      console.log(res)
      var list = res.data.list;
      var lists = that.data.lists;
      for (var i = 0; i < list.length; i++) {
        var goodlist = list[i].list;
        for (var s = 0; s < goodlist.length; s++) {
          if (goodlist[s].goods_img.indexOf(',') == -1) {} else {
            var imgUrls = goodlist[s].goods_img.split(',');
            goodlist[s].goods_img = imgUrls[0];
          }
        }
      }
      that.setData({
        lists: lists.concat(list)
      })
    },
    fail(res) {
      console.log(res);
    }
  });
}