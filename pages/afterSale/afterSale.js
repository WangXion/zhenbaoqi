//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    paths: [],
    img_list: [],
    dialog: false,
    shouhou_type: '',
    radioStr: '请选择>',
    color: "#bbb",
    order_number: '', //订单号
    items: [{
        name: 'a',
        value: '7天无理由退货'
      },
      {
        name: 'b',
        value: '商品质量问题',
      },
      {
        name: 'c',
        value: '商品错发'
      },
      {
        name: 'd',
        value: '收到商品破损'
      },
      {
        name: 'e',
        value: '收到商品与实际不符'
      },
      {
        name: 'f',
        value: '缺乏鉴别证书'
      },
      {
        name: 'g',
        value: '商品瑕疵'
      },
      {
        name: 'h',
        value: '其它'
      },
    ],
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      name: options.name,
      phone: options.phone,
      order_number: options.order_number
    })
  },
  //售后类型
  afterType(e) {
    var that = this;
    if (e.currentTarget.dataset.index == 1) {
      that.setData({
        shouhou_type: e.currentTarget.dataset.index
      })
    } else {
      that.setData({
        shouhou_type: e.currentTarget.dataset.index
      })
    }
  },
  radioChange(e) {
    var that = this;
    var str = null;
    for (var value of that.data.items) {
      if (value.name === e.detail.value) {
        str = value.value;
      }
    }
    this.setData({
      radioStr: str,
      color: "#000"
    });
  },
  //申请售后
  shouHou() {
    var that = this;
    var img_list = that.data.img_list;
    // console.log(img_list)
    var img_lists = img_list.toString()
    // console.log(img_lists)
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/order/after',
      method: 'post',
      data: {
        "after_img": img_lists,
        "after_type": that.data.shouhou_type,
        "after_why": that.data.radioStr,
        "order_number": that.data.order_number
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        console.log(res)
        //已经申请过售后
        if (res.data.mark == 1) {
          wx.showToast({
            title: res.data.tip,
            icon: 'none',
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../card/card'
            })
          }, 800)
          //未登录
        } else if (res.data.mark == 500) {
          wx.showToast({
            title: res.data.tip,
            icon: 'none',
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../login/login'
            })
          }, 800)
        } else if (res.data.mark == 0) {
          wx.navigateTo({
            url: '../saleStatus/saleStatus?order_number=' + this.data.order_number
          })
        }
      }
    })
  },
  //关闭弹窗
  Dialogf() {
    this.setData({
      dialog: false
    })
  },
  //开启弹窗
  Dialogt() {
    this.setData({
      dialog: true
    })
  },

  //添加图片
  addImg() {
    var that = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        var img_list = that.data.img_list;
        img_list.push(res.tempFilePaths[0])
        if (img_list.length > 3) {
          wx.showToast({
            title: '最多上传三张图片',
            icon: 'none',
            duration: 2000
          });
        } else {
          that.setData({
            img_list: img_list
          })
        }
      }
    })
  },
  //减去图片
  jianImg(e) {
    var indexs = e.currentTarget.dataset.index;
    var img_list = this.data.img_list;
    img_list.splice(indexs, 1);
    this.setData({
      img_list: img_list
    })
  },
  //上传图片
  upImg() {
    var that = this;
    var token = wx.getStorageSync('token');
    var img_list = that.data.img_list;
    var paths = [];
    img_list.map((value, index) => {
      wx.uploadFile({
        url: 'https://www.zbq888.cn/api/v1/proposal/photo/insert',
        filePath: value,
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
          var data = JSON.parse(res.data)
          paths.push(data.photo_url)
          that.setData({
            paths: paths
          })
        }
      })
    })
  },
})