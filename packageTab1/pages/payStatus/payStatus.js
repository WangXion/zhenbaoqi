//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    page: 1,
    hotRecommend: []
  },
  onLoad() {},
  onShow() {
    this.setData({
      page: 1,
      hotRecommend: []
    })
    getHotRecommend(1, this)
  },
  //去订单
  goCard() {
    wx.navigateTo({
      url: '../../../pages/card/card'
    })
  },
  //去商品详情
  goGoodDetail(e) {
    wx.navigateTo({
      url: '../../../pages/goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    })
    // if (e.currentTarget.dataset.id.type == 1) {
    //   wx.navigateTo({
    //     url: '../../../pages/goodDetail/goodDetail?id=' + e.currentTarget.dataset.id
    //   })
    //   // } else {
    //   //   wx.navigateTo({
    //   //     url: '../jiluDetail/jiluDetail?id=' + e.currentTarget.dataset.id
    //   //   })
    // }

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
      console.log(res)
      if (res.data.data == null) {
        that.setData({
          recommend: that.data.recommend
        })
      } else if (res.data.data.length == 0) {
        that.setData({
          recommend: that.data.recommend
        })
      } else if (res.data.mark == 0) {
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
      }
    }
  })
}