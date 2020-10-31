const app = getApp()

Page({
  data: {
    current1: 'tab1',
    current2: 'phone',
    page: 1,
    state: 0,
    list: []
  },
  onLoad() {

  },
  onShow() {
    var that = this;
    that.setData({
      list: [],
      page: 1
    })
    getproinfo(that.data.page, that, that.data.state)
  },
  //去详情页
  goHelpDetail(e) {
    var path = encodeURIComponent(e.currentTarget.dataset.links);
    wx.navigateTo({
      url: '../web_page/web_page' + '?path=' + path
    })
  },
  //顶部选项
  handleChange1({
    detail
  }) {
    var that = this;
    that.setData({
      current1: detail.key
    })
    if (detail.key == "tab1") {
      that.setData({
        page: 1,
        state: 0,
        list: []
      })
    } else if (detail.key == "tab2") {
      that.setData({
        page: 1,
        state: 1,
        list: []
      })
    } else if (detail.key == "tab3") {
      that.setData({
        page: 1,
        state: 2,
        list: []
      })
    } else if (detail.key == "tab4") {
      that.setData({
        page: 1,
        state: 3,
        list: []
      })
    }
    getproinfo(that.data.page, that, that.data.state)
  },
  //底部选项
  handleChange2({
    detail
  }) {
    this.setData({
      current2: detail.key
    })
    if (detail.key == 'phone') {
      wx.makePhoneCall({ //拨打客服电话
        phoneNumber: "15368664771",
      })
    } else if (detail.key == 'online') {
      wx.redirectTo({
        url: '../kefu/kefu'
      })
    }
  },
  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page = that.data.page + 1;
    getproinfo(that.data.page, that, that.data.state);
    wx.hideLoading();
  },
})
//加载
function getproinfo(page, that, state) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/article/help',
    method: 'post',
    data: {
      page_size: 10,
      cate_id: state,
      current_page: page
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      'token': token
    },
    success(res) {
      console.log(res)
      var list = that.data.list;
      for (var i = 0; i < res.data.list.length; i++) {
        list.push(res.data.list[i]);
      }
      that.setData({
        list: list
      })
    },
    fail(res) {
      console.log(res);
    }
  });
}