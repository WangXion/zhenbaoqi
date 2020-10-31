const app = getApp()

Page({
  data: {
    url: '',
  },
  onLoad(options) {
    console.log(options)

    this.setData({
      url: 'https://www.zbq888.cn/zhen_url/invitee.html?user_name=' + options.user_name + '&user_id=' + options.user_id + '&avatar=' + options.avatar
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