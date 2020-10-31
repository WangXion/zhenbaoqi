//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user_ava: '',
    date: '请选择',
    nickName: '请填写',
    phone: '请填写',
    site: '请填写',
    disabled: false,
    time: '获取验证码',
    currentTime: 60,
    setCode: false,
    btn: false,
    sex: '男',
    gender: '1',
    codes: '',
    user_data: {},
    one: false,
    two: false,
    three: false
  },
  onLoad() {
    var user_data = wx.getStorageSync('user_data');
    if (user_data.birthday == '') {
      this.setData({
        date: '请选择'
      })
    } else {
      this.setData({
        date: user_data.birthday
      })
    }
    if (user_data.gender == 1) {
      this.setData({
        sex: '男',
      })
    } else {
      this.setData({
        sex: '女',
      })
    }
    this.setData({
      user_ava: user_data.head_img,
      nickName: user_data.nick_name,
      phone: user_data.phone_no,
      user_data: user_data
    })
  },
  //修改日期
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      btn: true,
      three: true
    })
  },
  //选择图片
  changeAva() {
    var that = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          user_ava: tempFilePaths[0],
          btn: true,
          one: true
        })
      }
    })
  },
  //名字
  name(e) {
    this.setData({
      nickName: e.detail.value,
      btn: true,
      three: true
    })
  },
  //手机号
  phone(e) {
    var lengths = e.detail.value.length;
    if (lengths > 0) {
      this.setData({
        setCode: true,
        phone: e.detail.value,
        btn: true
      })
    } else {
      this.setData({
        setCode: false,
        phone: e.detail.value,
        btn: true
      })
    }
  },
  //获取验证码
  getCode() {
    var that = this;
    var phone = that.data.phone;
    var currentTime = that.data.currentTime;
    var interval;
    if (phone.length !== 11) { //判断手机号格式
      wx.showToast({
        title: '手机格式错误!',
        icon: "none",
        duration: 2000,
        mask: true
      })
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/send/message',
        method: 'post',
        data: {
          "phone_no": phone
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1
        },
        success: res => {
          if (res.data.tip == '成功') {
            wx.showToast({
              title: '短信验证码已发送',
              icon: 'success',
              duration: 2000
            });
            that.setData({
              time: currentTime + 's',
              disabled: true
            })
            interval = setInterval(function () {
              that.setData({
                time: (currentTime - 1) + ' s',
              })
              currentTime--;
              if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                  time: '重新获取',
                  currentTime: 60,
                  disabled: false
                })
              }
            }, 1000)
          } else if (res.data.tip == "短信发送失败") {
            wx.showToast({
              title: '短信发送失败，请稍后重试',
              icon: 'none',
              duration: 2000
            });
          }
        }
      })
    }
  },
  //输入验证码
  code(e) {
    this.setData({
      codes: e.detail.value,
      btn: true,
      two: true
    })
  },
  //设置性别
  sex(e) {
    var value = e.detail.value
    if (value == "男") {
      this.setData({
        gender: '1',
        btn: true,
        three: true
      })
    } else if (value == "女") {
      this.setData({
        gender: '2',
        btn: true,
        three: true
      })
    } else {
      this.setData({
        gender: '1',
        btn: false,
        three: true
      })
    }
  },
  //上传图片
  upPic() {
    const that = this;
    var token = wx.getStorageSync('token');
    wx.uploadFile({
      url: 'https://www.zbq888.cn/api/v1/user/head/img/update',
      filePath: that.data.user_ava,
      name: 'photo_file',
      header: {
        "token": token,
        "client": 1,
        "content-Type": "multipart/form-data",
      },
      formData: {
        "token": token,
      },
      success(res) {
        that.data.user_data.head_img = res.data.photo_url;
        wx.setStorageSync('user_data', that.data.user_data);
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //换绑手机号
  changePhone() {
    const that = this;
    var token = wx.getStorageSync('token');
    if (that.data.codes.length <= 0) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: 'https://www.zbq888.cn/api/v1/user/bind/phone',
        method: 'post',
        data: {
          "phone_no": phone
        },
        header: {
          'content-type': 'application/json', // 默认值
          "client": 1,
          "token": token
        },
        success(res) {
          that.data.user_data.phone_no = that.data.phone;
          wx.setStorageSync('user_data', that.data.user_data);
        }
      })
    }
  },
  //修改用户基本信息
  changeUser() {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/info/update',
      method: 'post',
      data: {
        "birthday": that.data.date,
        "gender": that.data.gender,
        "nick_name": that.data.nickName
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        "token": token
      },
      success(res) {
        console.log(res)
        if (res.data.tip == "请输入正确的生日") {
          wx.showToast({
            title: '请输入正确的生日',
            icon: 'none',
            duration: 1000
          });
        } else {
          that.data.user_data.birthday = that.data.date;
          that.data.user_data.gender = that.data.gender;
          that.data.user_data.nick_name = that.data.nickName;
          wx.setStorageSync('user_data', that.data.user_data);
        }

      }
    })
  },
  //提交
  submit() {
    if (this.data.one == true) {
      this.upPic()
    }
    if (this.data.two == true) {
      this.changePhone()
    }
    if (this.data.three == true) {
      this.changeUser()
    }
  },
  //去收货地址
  goSite() {
    wx.navigateTo({
      url: '../site/site'
    })
  }
})