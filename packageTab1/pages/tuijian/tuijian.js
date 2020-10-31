const app = getApp()

Page({
  onShareAppMessage(res) {
    var that = this;
    var userdata = wx.getStorageSync('user_data');
    return {
      title: userdata.nick_name + ' 向你推荐【甄宝气】',
      imageUrl: 'https://www.zbq888.cn/zhen_url/image/shareImg.png',
      path: 'pages/invitee/invitee?user_name=' + userdata.nick_name + '&user_id=' + userdata.user_id + '&avatar=' + userdata.head_img,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '分享成功'
        })
        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  data: {
    url: '',
  },
  onLoad() {
    var token = wx.getStorageSync('token');
    this.setData({
      url: 'https://www.zbq888.cn/zhen_url/yaoqing.html?token=' + token,
    })

  },
  getMessage(e) {
    if (!e.detail) {
      return
    }
    var datas = e.detail.data
    var type = datas.type;
    console.log(type)
  }
})