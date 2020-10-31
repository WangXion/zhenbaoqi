const app = getApp()

Page({
  data: {
    lengths: 0,
    textCounter: '',
    img_list: [],
    bgColor: 'rgba(202, 202, 202, 1)',
    paths: []
  },
  onLoad() {

  },
  //文本框
  textareas(e) {
    var that = this;
    if (1 <= e.detail.cursor <= 300) {
      that.setData({
        lengths: e.detail.cursor,
        textCounter: e.detail.value,
        bgColor: "rgba(232, 58, 57, 1)"
      })
    }
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
  //上传建议
  upSuggest(paths) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/proposal/insert',
      method: 'post',
      data: {
        "proposal_content": that.data.textCounter,
        "repair_picture": paths
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        "token": token
      },
      success(res) {
        console.log(res)
        if (res.data.mark == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 800
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '../mine/mine'
            })
          }, 1000)
        }
      }
    })
  },
  //提交
  submit() {
    var that = this;
    if (that.data.textCounter.length == 0) {
      wx.showToast({
        title: '建议内容不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (that.data.img_list.length > 0) {
      that.upImg();
      setTimeout(() => {
        var paths = that.data.paths.toString();
        that.upSuggest(paths)
      }, 1500);
    } else {
      var paths = '';
      that.upSuggest(paths);
    }
  }
})