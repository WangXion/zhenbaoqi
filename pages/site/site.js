const app = getApp()

Page({
  data: {
    page: 1,
    lists: [],
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    type: '',
    delateId: 0
  },
  onLoad(options) {
    if (options.type) { //type用来判断普通商品下单还是派品下单
      this.setData({
        type: options.type
      })
    } else {
      this.setData({
        type: ''
      })
    }
  },
  onShow() {
    var that = this;
    that.setData({
      list: [],
      page: 1
    })
    getList(that.data.page, that)
  },
  //删除地址
  deleteSite(e) {
    this.setData({
      dialogShow: true,
      delateId: e.currentTarget.dataset.asdid
    })
  },
  //确认删除地址？
  tapDialogButton(e) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (e.detail.index == 1) {
      this.setData({
        dialogShow: false
      })
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/address/delete',
        method: 'post',
        data: {
          ads_id: that.data.delateId
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          'token': token
        },
        success(res) {
          console.log(res)
          wx.showToast({
            title: '删除地址成功'
          })
          that.setData({
            list: [],
            page: 1
          })
          getList(that.data.page, that)
        }
      })
    } else {
      this.setData({
        dialogShow: false
      })
    }
  },
  //添加地址
  setSite() {
    wx.navigateTo({
      url: '../setSite/setSite?state=1'
    })
  },
  //由订单页跳转过来选择地址
  selectSite(e) {
    if (this.data.type == '') { //编辑地址
      var sitename = encodeURIComponent(e.currentTarget.dataset.sitename)
      wx.navigateTo({
        url: '../setSite/setSite?state=2&name=' + e.currentTarget.dataset.name + '&phone=' + e.currentTarget.dataset.phone + '&address=' + e.currentTarget.dataset.address + '&asdid=' + e.currentTarget.dataset.asd + '&default=' + e.currentTarget.dataset.default+'&sitename=' + sitename + '&countyid=' + e.currentTarget.dataset.countyid + '&provinceid=' +  e.currentTarget.dataset.provinceid + '&cityid=' + e.currentTarget.dataset.cityid
      })
    } else if (this.data.type == 'card1') { //普通商品下单
      console.log(e)
      var data = {
        adsId: e.currentTarget.dataset.asd,
        name: e.currentTarget.dataset.name,
        phone: e.currentTarget.dataset.phone,
        sitename: e.currentTarget.dataset.sitename,
        address: e.currentTarget.dataset.address,
      }
      wx.setStorageSync('cardSite', data)
      wx.navigateBack({
        url: '../onOrder/onOrder'
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
    getList(that.data.page, that)
    wx.hideLoading();
  },
})
//获取地址列表
function getList(page, that) {
  var token = wx.getStorageSync('token');
  wx.request({
    url: 'https://www.zbq888.cn/api/v1/user/address/list',
    method: 'post',
    data: {
      "page_size": 10,
      "current_page": page
    },
    header: {
      'content-type': 'application/json',
      "client": 1,
      'token': token
    },
    success(res) {
      var lists = [];
      if (res.data.userAddresss == null) {
        that.setData({
          lists: []
        })
      } else {
        for (var i = 0; i < res.data.userAddresss.length; i++) {
          lists.push(res.data.userAddresss[i])
          that.setData({
            lists: lists
          })
        }
      }
    },
    fail(res) {
      console.log(res);
    }
  });
}