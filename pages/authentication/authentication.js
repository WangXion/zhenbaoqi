const app = getApp()

Page({
  data: {
    bgColor: 'rgb(221, 221, 221)',
    name: "",
    card: "",
    type: 1
  },
  onLoad() {

  },
  onShow() {
    this.getUser();
  },
  //输入名字
  names(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //输入身份证号码
  card(e) {
    var lengths = e.detail.value.length;
    if (lengths < 18) {
      this.setData({
        card: e.detail.value,
        bgColor: 'rgb(221, 221, 221)'
      })
    } else {
      this.setData({
        card: e.detail.value,
        bgColor: "rgba(255, 61, 61, 1)"
      })
    }
  },
  //提交
  submit() {
    var token = wx.getStorageSync('token');
    if (this.data.type == 1) {
      if (this.data.name.length == 0) {
        wx.showToast({
          title: '姓名不能为空!',
          icon: "none",
          duration: 2000,
          mask: true
        })
      } else if (this.data.card.length < 18) {
        wx.showToast({
          title: '请输入正确的身份证号!',
          icon: "none",
          duration: 2000,
          mask: true
        })
      } else {
        wx.request({
          url: 'https://www.zbq888.cn/api/v1/user/real/name',
          method: 'post',
          data: {
            "id_no": this.data.card,
            "real_name": this.data.name
          },
          header: {
            'content-type': 'application/json', // 默认值
            "client": 1,
            "token": token
          },
          success: res => {
            if (res.data.tip == "请输入正确身份证号") {
              wx.showToast({
                title: '请输入正确的身份证号(如有X应为大写)!',
                icon: "none",
                duration: 2000,
                mask: true
              })
            } else if (res.data.tip == '成功') {
              wx.showToast({
                title: '认证成功!',
                icon: "success",
                duration: 2000,
                mask: true
              })
            } else if (res.data.tip == "已实名认证") {
              wx.showToast({
                title: '已经实名认证,请勿重复认证',
                icon: "none",
                duration: 2000,
                mask: true
              })
            }
          }
        })
      }
    }
  },
  //实名认证回显
  getUser() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/real/namelist',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        "token": token
      },
      success: res => {
        // console.log(res)
        that.setData({
          type: res.data.is_real,
          name: res.data.real_name,
          card: res.data.id_no
        })
      }
    })
  }
})