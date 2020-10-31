const app = getApp()

Page({
  data: {
    values: "", //搜索内容
    history_search: [], //历史搜索结果
    hot_search: [], //热门搜索结果
    search_status: []
  },
  onLoad() {
    this.historySearch()
  },
  //关闭历史搜索
  clearHistory() {
    this.setData({
      search_history: false,
    })
  },
  //点击热门搜索,历史搜索
  searchGoods(e) {
    this.setData({
      values: e.currentTarget.dataset.value,
    })
    wx.navigateTo({
      url: '../searchStatus/searchStatus?type=2' + '&value=' + e.currentTarget.dataset.value,
    })
  },
  //搜索框内容
  searchs(e) {
    console.log(e)
    var that = this;
    clearTimeout(time)
    that.setData({
      values: e.detail.value,
    })
    if (e.detail.cursor > 0) {
      var time = setTimeout(() => {
        that.searchGoodss(e.detail.value)
      }, 600)
    } else {
      that.setData({
        search_status: [],
      })
      that.historySearch()
    }
  },
  //回车键搜索
  enterSearch(e) {
    var that = this;
    that.setData({
      values: e.detail.value,
    })
    wx.navigateTo({
      url: '../searchStatus/searchStatus?type=2' + '&value=' + e.detail.value
    })
  },
  //点击搜索
  searchRightBtn() {
    wx.navigateTo({
      url: '../searchStatus/searchStatus?type=2' + '&value=' + this.data.values
    })
  },
  //获取热门历史记录
  historySearch() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/goods/serach/param/list',
      method: 'post',
      data: {},
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
          that.setData({
            hot_search: res.data.total_serachs
          })
          if (res.data.user_serachs.length == 0) {
            that.setData({
              history_search: [],
              search_history: false
            })
          } else {
            that.setData({
              history_search: res.data.user_serachs,
              search_history: true
            })
          }
        }

      }
    })
  },
  //输入时
  searchGoodss(value) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/goods/homesearch',
      method: 'post',
      data: {
        "current_page": 1,
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
          that.setData({
            search_status: res.data.list
          })
        }

      }
    })
  }
})