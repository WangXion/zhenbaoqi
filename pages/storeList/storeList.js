const app = getApp()

Page({
  data: {
    list: [],
  },
  onLoad() {
    // this.getList()
  },
  //去普通商品详情
  goDetail() {
    wx.navigateTo({
      url: '../goodDetail/goodDetail'
    })
  },
  //去店铺详情
  goStore() {
    wx.navigateTo({
      url: '../store/store'
    })
  },
  // //获取商铺列表
  // getList() {
  //   wx.request({
  //     url: 'https://www.zbq888.cn/api/v1/optMerchants',
  //     method: 'post',
  //     data: {},
  //     header: {
  //       "client": 1,
  //       token: token
  //     },
  //     dataType: "json",
  //     success(res) {
  //       console.log(res)
  //     }
  //   })
  // }
})