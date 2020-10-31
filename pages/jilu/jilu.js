const app = getApp()

Page({
  data: {
    list: [],
    page: 1,
  },
  onLoad() {

  },
  onShow() {
    getList(1, this)
  },
  // //去pm详情
  // goDetail() {
  //   wx.navigateTo({
  //     url: '../jiluDetail/jiluDetail'
  //   })
  // }

  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page = that.data.page + 1;
    getList(that.data.page, that)
    wx.hideLoading();
  }
})
//获取记录列表
function getList(page, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/user/auction/bind/list',
    method: 'post',
    data: {
      "current_page": page,
      "page_size": 10,
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      "token": token
    },
    success(res) {
      console.log(res)
      if (res.data.list == null) {
        that.setData({
          list: []
        })
      } else if (res.data.list.length == 0) {
        that.setData({
          list: []
        })
      } else {

      }
    }
  })
}