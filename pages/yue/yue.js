const app = getApp()

Page({
  data: {
    balance: '0', //余额
    current: 'tab1',
    state: 0,
    page: 1,
    lists: [] //账单列表

  },
  onLoad() {
    this.getUserWallet()
    getproinfo(1, this, 0);
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
        state: 0,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab2') {
      that.setData({
        state: 1,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab3') {
      that.setData({
        state: 2,
        page: 1,
        lists: []
      })
    } else if (detail.key == 'tab4') {
      that.setData({
        state: 3,
        page: 1,
        lists: []
      })
    }
    getproinfo(that.data.page, that, that.data.state)
  },
  //去交易详情
  goDetail(e) {
    if (e.currentTarget.dataset.type == 1) { //充值/收入

    } else if (e.currentTarget.dataset.type == 3) { //购物支出
      wx.navigateTo({
        url: '../cardDetail/cardDetail?ordernum=' + e.currentTarget.dataset.odernum
      })
    } else if (e.currentTarget.dataset.type == 2) { //提现支出
      wx.navigateTo({
        url: '../bill/bill?ordernum=' + e.currentTarget.dataset.odernum
      })
    }

  },
  //去提现页
  goTixian() {
    wx.navigateTo({
      url: '../tixian/tixian'
    })
  },
  // //去充值页
  // goRecharge() {
  //   wx.navigateTo({
  //     url: '../recharge/recharge'
  //   })
  // },
  //获取用户账户信息
  getUserWallet() {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      list: [],
      page: 1,
    })
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/balance', //用户余额
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json',
        "client": 1,
        'token': token
      },
      success(res) {
        that.setData({
          balance: res.data.balance
        })
      }
    })
  }
})
//加载
function getproinfo(page, that, state) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/user/change/list',
    method: 'post',
    data: {
      "page_size": 10,
      "change_type": state,
      "current_page": page
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      'token': token
    },
    success(res) {
      console.log(res)

      function formatDate(now) { // 对获取到的字符串转换
        var year = now.getFullYear(); //取得4位数的年份
        var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
        var date = now.getDate(); //返回日期月份中的天数（1到31）
        var hour = now.getHours(); //返回日期中的小时数（0到23）
        var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
        var second = now.getSeconds(); //返回日期中的秒数（0到59）
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      }
      if (res.data.current_page == 1) {
        if (res.data.list.length == 0) {
          that.setData({
            lists: []
          })
        } else if (res.data.list == null) {
          that.setData({
            lists: []
          })
        } else {
          for (var i = 0; i < res.data.list.length; i++) {
            var time = formatDate(new Date(res.data.list[i].asset_time * 1));
            res.data.list[i].asset_time = time;
            var listss = [];
            listss.push(res.data.list[i])
            that.setData({
              lists: listss
            })
          }
        }
      } else {
        if (res.data.list == null) {} else if (res.data.list.length == 0) {} else {
          for (var i = 0; i < res.data.list.length; i++) {
            var lists = that.data.lists;
            var time = formatDate(new Date(res.data.list[i].asset_time * 1));
            res.data.list[i].asset_time = time;
            that.setData({
              lists: lists.push(res.data.list[i])
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