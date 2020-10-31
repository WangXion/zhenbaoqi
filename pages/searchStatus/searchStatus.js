const app = getApp()

Page({

  data: {
    list: [],
    page: 1,
    state: 3,
    type: 3,
    values: "", //搜索内容
    current: 'tab1',
    showRight: false,
    indexss: 0,
    serveselect: ['综合排名', '优店', '包邮', '包退', '热门'],
    type: 1,
    fid: 0,
    cid: 0,
    ccid: 0,
    ccidList: [{
      code_name: '全部',
      dict_id: 0,
      code_value: ''
    }],
    indexs: 0
  },
  onLoad(options) {
    if (options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode)
    }
    wx.setNavigationBarTitle({
      title: options.value
    })
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '../login/login',
        })
      }, 1000)
    } else {
      if (options.type == 1) { //type判断是列表页搜索还是模糊搜索
        this.setData({
          values: options.value,
          list: [],
          page: 1,
          state: 3,
          current: 'tab1',
          type: 1,
          fid: options.fid,
          cid: options.cid,
          ccid: 0
        })
        searchGoods(this.data.page, this, options.fid, options.cid, 0, 3)
        this.getCCIdList(options.cid)
      } else if (options.type == 2) {
        this.setData({
          values: options.value,
          list: [],
          page: 1,
          state: 3,
          current: 'tab1',
          type: 2
        })
        searchGoodss(this.data.page, this, this.data.values)
      }
    }
  },
  serveSelect(e) {
    this.setData({
      indexss: e.currentTarget.dataset.index
    })
  },
  //关闭抽屉
  toggleRight() {
    this.setData({
      showRight: !this.data.showRight
    });
  },
  //选择三级类别
  selectTab(e) {
    this.setData({
      ccid: e.currentTarget.dataset.id,
      indexs: e.currentTarget.dataset.index,
      list: [], //搜索结果
      page: 1,
    })
    searchGoods(this.data.page, this, this.data.fid, this.data.cid, e.currentTarget.dataset.id, this.data.state)
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
        list: [],
        page: 1,
        state: 3,
        indexs: 0,
        ccidList: [{
          code_name: '全部',
          dict_id: 0,
          code_value: ''
        }],
      })
      if (that.data.type == 1) {
        searchGoods(that.data.page, that, that.data.fid, that.data.cid, 0, 3);
        that.getCCIdList(that.data.cid)
      } else {
        searchGoodss(that.data.page, that, that.data.values)
      }
    } else if (detail.key == 'tab2') {
      that.setData({
        list: [],
        page: 1,
        state: 2,
        indexs: 0,
        ccidList: [{
          code_name: '全部',
          dict_id: 0,
          code_value: ''
        }],
      })
      if (that.data.type == 1) {
        searchGoods(that.data.page, that, that.data.fid, that.data.cid, 0, 2)
        that.getCCIdList(that.data.cid)
      } else {
        searchGoodss(that.data.page, that, that.data.values)
      }
    } else if (detail.key == 'tab3') {
      that.setData({
        list: [],
        page: 1,
        state: 1,
        indexs: 0,
        ccidList: [{
          code_name: '全部',
          dict_id: 0,
          code_value: ''
        }],
      })
      if (that.data.type == 1) {
        searchGoods(that.data.page, that, that.data.fid, that.data.cid, 0, 1)
        that.getCCIdList(that.data.cid)
      } else {
        searchGoodss(that.data.page, that, that.data.values)
      }
    }
  },
  //去商品详情
  goGoodDetail(e) {
    // // console.log(e)
    // if (e.currentTarget.dataset.type == 1) {
    //   wx.navigateTo({
    //     url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../jiluDetail/jiluDetail?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type
    //   })
    // }
    wx.navigateTo({
      url: '../goodDetail/goodDetail?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type
    })
  },
  //触底加载
  onReachBottom() {
    var that = this;
    wx.showLoading({
      title: '玩命加载中...',
    });
    that.data.page = that.data.page + 1;
    if (that.data.type == 1) {
      searchGoods(that.data.page, that, that.data.fid, that.data.cid, that.data.ccid, that.data.state)

    } else {
      searchGoodss(that.data.page, that, that.data.values)
    }
    wx.hideLoading();
  },
  //获取三级分类
  getCCIdList(cid) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/dict/son/list',
      method: 'post',
      data: {
        parent_id: cid
      },
      header: {
        "client": 1,
        token: token
      },
      dataType: "json",
      success(res) {
        var list = res.data.dicts;
        var lists = that.data.ccidList;
        var arr = lists.concat(list)
        that.setData({
          ccidList: arr
        })
      }
    })
  },
})
//列表页进入精确搜索
function searchGoods(page, that, fid, cid, ccid, state) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/goods/search',
    method: 'post',
    data: {
      "cate_id1": fid,
      "cate_id2": cid,
      "cate_id3": ccid,
      "current_page": page,
      "page_size": 10,
      "search_param": '',
      "state": state
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      "token": token
    },
    success(res) {
      // console.log(res)
      if (res.data.mark == 500) {
        wx.showToast({
          title: '登录失效',
          icon: 'none'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '../login/login'
          })
        }, 1000)
      } else if (res.data.mark == 501) {
        wx.showToast({
          title: '未绑定手机号',
          icon: 'none'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '../changePw/changePw?state=1'
          })
        }, 1000)
      } else {
        var data = res.data.list;
        if (data == null) {
          that.setData({
            list: []
          })
        } else {
          var list = that.data.list;
          for (var i = 0; i < data.length; i++) {
            if (data[i].goods_img.indexOf(',') == -1) {
              list.push(data[i])
            } else {
              var eidx = data[i].goods_img.indexOf(',');
              var imgUrl = data[i].goods_img.substring(0, eidx)
              data[i].goods_img = imgUrl;
              list.push(data[i])
            }
          }
          that.setData({
            list: list
          })
        }
      }

    }
  })
}
//首页进入模糊搜索
function searchGoodss(page, that, value) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/goods/homesearch',
    method: 'post',
    data: {
      "current_page": page,
      "page_size": 10,
      "search_param": value,
    },
    header: {
      'content-type': 'application/json', // 默认值
      "client": 1,
      "token": token
    },
    success(res) {
      // console.log(res)
      if (res.data.mark == 500) {
        wx.showToast({
          title: '登录失效',
          icon: 'none'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '../login/login'
          })
        }, 1000)
      } else if (res.data.mark == 501) {
        wx.showToast({
          title: '未绑定手机号',
          icon: 'none'
        })
        setTimeout(() => {
          wx.reLaunch({
            url: '../changePw/changePw?state=1'
          })
        }, 1000)
      } else {
        var data = res.data.list;
        if (data == null) {
          that.setData({
            list: []
          })
        } else {
          var list = that.data.list;
          for (var i = 0; i < data.length; i++) {
            if (data[i].goods_img.indexOf(',') == -1) {
              list.push(data[i])
            } else {
              var eidx = data[i].goods_img.indexOf(',');
              var imgUrl = data[i].goods_img.substring(0, eidx)
              data[i].goods_img = imgUrl;
              list.push(data[i])
            }
          }
          that.setData({
            list: list
          })
        }
      }

    }
  })
}