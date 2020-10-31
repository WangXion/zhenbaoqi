//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list: []
  },
  onLoad() {

  },
  onShow() {
    this.getLiveList()
  },
  //获取直播间列表
  getLiveList() {
    var that = this;
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/wxLive/getliveinfo',
      method: 'post',
      data: {
        "limit": 10,
        "start": 0
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
      },
      success(res) {
        // console.log(res)
        that.setData({
          list: res.data.room_info
        })

      }
    })
  },
  //去直播间
  goLive(e) {
    console.log(e)
    var index = e.currentTarget.dataset.roomid;
    let roomId = [index] // 房间号
    let customParams = {
      path: 'pages/liveDetail/liveDetail'
    }
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}&type=9&close_picture_in_picture_mode=1`
    })
    // wx.navigateTo({
    //   url: '../liveDetail/liveDetail?roomid=' + index
    // })
  },

})