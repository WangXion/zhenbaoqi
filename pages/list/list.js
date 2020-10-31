//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////列表页的数据将在首页获取，为了避免数据加载未完成导致双联动功能失效问题///////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var app = getApp();
//声明全局变量
let proListToTop = [],
  menuToTop = [],
  MENU = 0,
  windowHeight, timeoutId;
// MENU ==> 是否为点击左侧进行滚动的，如果是，则不需要再次设置左侧的激活状态
Page({
  data: {
    currentActiveIndex: 0,
    values: '',
    rightProTop: 1,
    goodList: [],
    loginState: 0,
    navList: [],
    lists: [],
    recommend: { //列表页
      code_name: '推荐列表',
      code_value: '',
      list: []
    },
  },
  onLoad(options) {
    if (options.inviteCode) {
      wx.setStorageSync('inviteCode', options.inviteCode)
    }
    if (wx.getStorageSync('goodList')) {
      var goodList = wx.getStorageSync('goodList');
      this.setData({
        goodList: goodList
      })
      this.getAllRects()

    } else {
      this.getFList()
      this.getRecommend()
    }
    // 注意***************确保页面数据已经刷新完毕********************************~
  },
  onShow() {
    if (!wx.getStorageSync('token')) {
      this.setData({
        loginState: 0
      })
    } else {
      this.setData({
        loginState: 1
      })
    }

  },

  //获取商品一级列表
  getFList() {
    var that = this;
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/dict/list',
      method: 'post',
      data: {
        code_type: 'goods_category'
      },
      header: {
        "client": 1,
        token: '2e865157-4c13-4dcb-b890-3fac16458ec5'
      },
      dataType: "json",
      success(res) {
        var dictss = res.data.dicts;
        for (let i = 0; i < dictss.length; i++) {
          dictss[i] = {
            code_name: dictss[i].code_name,
            code_value: dictss[i].code_value,
            dict_id: dictss[i].dict_id,
            list: []
          }
        }
        that.setData({
          navList: dictss
        })
        that.getCList(0, dictss.length)
      }
    })
  },
  //获取商品二级列表
  getCList(i, length) { /// 此处使用递归（规避异步请求导致某些数据丢包的问题）
    var that = this;
    var lists = that.data.lists;
    var navList = this.data.navList;
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/dict/son/list',
      method: 'post',
      data: {
        parent_id: navList[i].dict_id
      },
      header: {
        "client": 1,
        token: '2e865157-4c13-4dcb-b890-3fac16458ec5'
      },
      dataType: "json",
      success(res) {
        var data = {
          f_id: navList[i].dict_id,
          list: res.data.dicts
        }
        lists.push(data);
        that.setData({
          lists: lists
        })
        if (++i < length) {
          // console.log(i)
          that.getCList(i, length)
        } else {
          that.merged()
        }
      }
    })
  },
  //获取列表页推荐
  getRecommend() {
    var that = this;
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/dict/recommend/list',
      method: 'post',
      data: {},
      header: {
        "client": 1,
        token: '2e865157-4c13-4dcb-b890-3fac16458ec5'
      },
      dataType: "json",
      success(res) {
        // console.log(res)
        var recommends = that.data.recommend;
        recommends.list = res.data.dicts;
        that.setData({
          recommend: recommends
        })
      }
    })
  },
  //一级二级合并
  merged() {
    var that = this;
    var navList = that.data.navList;
    var lists = that.data.lists;
    var recommend = that.data.recommend;
    for (let i = 0; i < navList.length; i++) {
      for (let s = 0; s < lists.length; s++) {
        if (navList[i].dict_id == lists[s].f_id) {
          navList[i].list = lists[s].list
        }
      }
    }
    navList.unshift(recommend);
    // console.log(navList)
    wx.setStorageSync('goodList', navList)
    this.setData({
      goodList: navList
    })
    this.getAllRects()
  },
  //去搜索页
  goSearch() {
    if (this.data.loginState == 0) {
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
      wx.navigateTo({
        url: '../search/search'
      })
    }
  },
  goSearchs(e) {
    if (this.data.loginState == 0) {
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
      if (e.currentTarget.dataset.ffid == null) {
        wx.navigateTo({
          url: '../searchStatus/searchStatus?fid=' + e.currentTarget.dataset.fid + '&cid=' + e.currentTarget.dataset.cid + '&type=1' + '&value=' + e.currentTarget.dataset.text
        })
      } else {
        var fid = e.currentTarget.dataset.ffid;
        wx.navigateTo({
          url: '../searchStatus/searchStatus?fid=' + fid + '&cid=' + e.currentTarget.dataset.cid + '&type=1' + '&value=' + e.currentTarget.dataset.text
        })
      }
    }
  },
  //**************************注意,这些方法只能数据先加载才能调用,否则会报错,可以在其他页面将数据加载好,保存到本地*********************************
  changeMenu(e) {
    // console.log(proListToTop);
    // 改变左侧tab栏操作
    if (Number(e.target.id) === this.data.currentActiveIndex) return
    MENU = 1
    this.setData({
      currentActiveIndex: Number(e.target.id),
      rightProTop: proListToTop[Number(e.target.id)]
    })
    this.setMenuAnimation(Number(e.target.id))
  },
  scroll(e) {
    // console.log(e);
    for (let i = 0; i < proListToTop.length; i++) {
      if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
        return this.setDis(i)
      }
    }
    // 找不到匹配项，默认显示第一个数据
    if (!MENU) {
      this.setData({
        currentActiveIndex: 0
      })
    }
    MENU = 0
  },
  setDis(i) {
    // 设置左侧menu栏的选中状态
    if (i !== this.data.currentActiveIndex + 1 && !MENU) {
      this.setData({
        currentActiveIndex: i - 1
      })
    }
    MENU = 0
    this.setMenuAnimation(i)
  },
  setMenuAnimation(i) {
    // 设置动画，使menu滚动到指定位置。
    let self = this
    // console.log(33)
    if (menuToTop[i].animate) {
      // console.log(11111)
      // 节流操作
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        // console.log(12138)
        self.setData({
          leftMenuTop: (menuToTop[i].top - windowHeight)
        })
      }, 50)
    } else {
      // console.log(11)
      if (this.data.leftMenuTop === 0) return
      // console.log(22)
      this.setData({
        leftMenuTop: 0
      })
    }
  },
  getActiveReacts() {
    wx.createSelectorQuery().selectAll('.menu-active').boundingClientRect(function (rects) {
      return rects[0].top
    }).exec()
  },
  getAllRects() {

    // 获取商品数组的位置信息
    wx.createSelectorQuery().selectAll('.pro-item').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        // console.log(rect)
        // 这里减去44是根据你的滚动区域距离头部的高度，如果没有高度，可以将其删去
        proListToTop.push(rect.top - 160) //(如果右边列表的顶部放东西，可以调整)=======》》》》》》》重要
      })
    }).exec()

    // 获取menu数组的位置信息
    wx.createSelectorQuery().selectAll('.menu-item').boundingClientRect(function (rects) {
      wx.getSystemInfo({
        success: function (res) {
          // console.log(res);
          windowHeight = res.windowHeight / 2
          // console.log(windowHeight)
          rects.forEach(function (rect) {
            menuToTop.push({
              top: rect.top,
              animate: rect.top > windowHeight
            })
          })
        }
      })
    }).exec()
  },
  // 获取系统的高度信息
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight / 2
      }
    })
  }
})