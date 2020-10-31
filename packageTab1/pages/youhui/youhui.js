const app = getApp()

Page({
  data: {
    page: 1,
    current: 'tab1',
    state: 0,
    list: [],
    ke: true,
    yi: false,
    guo: false
  },
  onLoad() {
    this.setData({
      list: [],
      page: 1
    })
    getproinfo(1, this, 0)
  },
  //选项栏
  handleChange({
    detail
  }) {
    var that = this;
    that.setData({
      current: detail.key
    });
    if (detail.key == 'tab1') {
      that.setData({
        state: 0,
        page: 1,
        list: [],
        ke: true,
        yi: false,
        guo: false
      })
      getproinfo(1, that, 0);
    } else if (detail.key == 'tab2') {
      that.setData({
        state: 1,
        page: 1,
        list: [],
        ke: false,
        yi: true,
        guo: false
      })
      getproinfo(1, that, 1);
    } else if (detail.key == 'tab3') {
      that.setData({
        state: 2,
        page: 1,
        list: [],
        ke: false,
        yi: false,
        guo: true
      })
      getproinfo(1, that, 2);
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
  //去使用优惠卷
  goUse() {
    wx.navigateTo({
      url: '../lyqp/lyqp'
    })
  }
})
//加载
function getproinfo(page, that, state) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/coupons/list',
    method: 'post',
    data: {
      "page_size": 10,
      "state": state,
      "current_page": page,
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      'token': token
    },
    success(res) {
      console.log(res)
      var lists = that.data.list;
      if (res.data.current_page == 1 || res.data.current_page == 0) {
        if (res.data.list == null) {
          that.setData({
            list: lists
          })
        } else if (res.data.list.length == 0) {
          that.setData({
            list: lists,

          })
        } else {
          that.setData({
            list: res.data.list,
          })
        }
      } else {
        that.setData({
          list: lists.concat(res.data.list),
        })
      }
    },
    fail(res) {
      console.log(res);
    }
  });

}