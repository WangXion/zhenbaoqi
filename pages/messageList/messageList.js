const app = getApp()

Page({
  data: {
    type: 4,
    list: [],
    page: 1
  },
  onLoad(options) {
    this.setData({
      type: options.type
    })

  },
  onShow() {
    var that = this;
    that.setData({
      list: [],
      page: 1
    })
    if (that.data.type == 4) {
      getNotice(1, that)
    } else {
      getList(that.data.page, that, that.data.type)
    }
  },
  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page = that.data.page + 1;
    if (that.data.type == 4) {
      getNotice(that.data.page, that)
    } else {
      getList(that.data.page, that, that.data.type)
    }
    wx.hideLoading();
  },
  //去消息详情页
  goDetail(e) {
    if (this.data.type == 4) {
      var urL = encodeURIComponent(e.currentTarget.dataset.url);
      wx.navigateTo({
        url: '../messageDetail/messageDetail?path=' + urL + '&type=4'
      })
    } else {
      wx.navigateTo({
        url: '../messageDetail/messageDetail?type=' + this.data.type
      })
    }
  }
})
//加载
function getList(page, that, type) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/user/message/list',
    method: 'post',
    data: {
      "page_size": 10,
      "message_type": type,
      "current_page": page
    },
    header: {
      'content-type': 'application/json',
      "client": 1,
      'token': token
    },
    success(res) {
      console.log(res)

    },
    fail(res) {
      console.log(res);
    }
  });
}
//获取官方公告文章列表
function getNotice(page, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/article/notice',
    method: 'post',
    data: {
      "cate_id": 5,
      "current_page": page,
      "page_size": 10
    },
    header: {
      'content-type': 'application/json',
      "client": 1,
      'token': token
    },
    success(res) {
      // console.log(res)
      var list = res.data.list;
      var lists = that.data.list;

      function formatDate(now) { // 对获取到的字符串转换
        var year = now.getFullYear(); //取得4位数的年份
        var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
        var date = now.getDate(); //返回日期月份中的天数（1到31）
        var hour = now.getHours(); //返回日期中的小时数（0到23）
        var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
        var second = now.getSeconds(); //返回日期中的秒数（0到59）
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
      }
      for (var i = 0; i < list.length; i++) {
        var time = formatDate(new Date(list[i].mod_date * 1));
        list[i].mod_date = time;
      }
      that.setData({
        list: lists.concat(list)
      })

    },
    fail(res) {

    }
  });
}