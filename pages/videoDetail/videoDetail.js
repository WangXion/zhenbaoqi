const app = getApp()

Page({
  data: {
    //测试视频列表
    videoList: [{
        "typeid": 1,
        "username": '吴先生',
        "state": 1,
        "userhead": "https://p3.pstatp.com/large/43700001e49d85d3ab52",
        "videoname": "测试视频1",
        "videourl": "https://media.w3.org/2010/05/sintel/trailer.mp4",
        "shoucang": 1
      },
      {
        "typeid": 2,
        "username": '刘先生',
        "state": 0,
        "shoucang": 0,
        "userhead": "https://p3.pstatp.com/large/43700001e49d85d3ab52",
        "videoname": "测试视频2",
        "videourl": "http://www.w3school.com.cn/example/html5/mov_bbb.mp4"
      },
    ],
    //  //测试直播地址
    // liveList:[
    //   {
    //     "typeid": 1,
    //     "videoimg": "../../images/p001.png",
    //     "videoname": "直播视频1", "videourl":'http://pili-media.live-test.v2gogo.com/recordings/z1.v2gogo-live-test.620b18566a5d4848b6d8ca789a1120c3/1534301729.flv'
    //   },
    //   {
    //     "typeid": 2,
    //     "videoimg": "../../images/p001.png",
    //     "videoname": "直播视频2", "videourl": 'http://pili-media.live-test.v2gogo.com/recordings/z1.v2gogo-live-test.620b18566a5d4848b6d8ca789a1120c3/1534301729.flv'
    //   }
    // ],
    // 评论
    pinluns: [{
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      },
      {
        img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
        name: '王先生',
        time: '9小时前',
        text: "这物件儿不错"
      }
    ],
    playerType: 'video',
    fitType: 'contain',
    pinlun: false,
    max: 30,
    values: ''
  },
  //修改视频属性 保证只有一个video被创建
  controlVideoPlayer: function (list, index) {
    if (list.length === 0) {
      return [];
    } else {
      list.forEach((item, i) => {
        if (index === i) {
          item.video_is_player = true;
        } else {
          item.video_is_player = false;
        }
      });
      return list;
    }
  },
  onLoad: function () {
    if (this.data.playerType === 'video') {
      let videolist = this.controlVideoPlayer(this.data.videoList, 0);
      this.setData({
        videoList: videolist,
        pinlun: false
      });
    } else {
      let _listlist = this.controlVideoPlayer(this.data.liveList, 0);
      this.setData({
        videoList: _listlist,
        pinlun: false
      });
    }
  },
  shuRu(e) {
    this.setData({
      values: e.detail.value
    })
  },
  send() {
    var user_data = wx.getStorageSync('user_data');
    var pinluns = this.data.pinluns;
    var add = {
      img: user_data.head_img,
      name: user_data.nick_name,
      time: '刚刚',
      text: this.data.values
    };
    pinluns.push(add);
    this.setData({
      pinluns: pinluns,
      values: ''
    })
    wx.showToast({
      title: '评论成功',
      icon: 'success',
      duration: 500
    })
  },
  pinlunOFF() {
    this.setData({
      pinlun: false
    });
  },
  //上滑事件
  swipeUpper: function (e) {
    const {
      newindex
    } = e.detail;
    let videolist = this.controlVideoPlayer(this.data.videoList, newindex);
    this.setData({
      videoList: videolist,
      pinlun: false
    });
  },
  //下滑事件
  swipeDown: function (e) {
    const {
      newindex
    } = e.detail;
    let videolist = this.controlVideoPlayer(this.data.videoList, newindex);
    this.setData({
      videoList: videolist,
      pinlun: false
    });
  },
  //下滑到最后一条数据
  swipeToEnd: function (e) {
    // wx.showLoading({
    //   title: '加载中',
    //   duration: 1000
    // })
    const {
      newindex,
      playerType
    } = e.detail;
    var newdata = [{
        "typeid": 3,
        "videoname": "测试视频3",
        "username": '王先生',
        "state": 1,
        "shoucang": 0,
        "userhead": "https://p3.pstatp.com/large/43700001e49d85d3ab52",
        "videourl": "http://vjs.zencdn.net/v/oceans.mp4"
      },
      {
        "typeid": 4,
        "videoname": "测试视频3",
        "username": '胡先生',
        "state": 1,
        "shoucang": 0,
        "userhead": "https://p3.pstatp.com/large/43700001e49d85d3ab52",
        "videourl": "http://vjs.zencdn.net/v/oceans.mp4"
      }
    ]
    // //live mode
    // newdata = [{
    //   "typeid": 2,
    //   "videoimg": "../../images/p001.png",
    //   "videoname": "直播视频2", "videourl": 'http://pili-media.live-test.v2gogo.com/recordings/z1.v2gogo-live-test.620b18566a5d4848b6d8ca789a1120c3/1534301729.flv'
    // }, {
    //     "typeid": 2,
    //     "videoimg": "../../images/p001.png",
    //     "videoname": "直播视频2", "videourl": 'http://pili-media.live-test.v2gogo.com/recordings/z1.v2gogo-live-test.620b18566a5d4848b6d8ca789a1120c3/1534301729.flv'
    //   }];

    let res = this.data.videoList;
    this.setData({
      videoList: this.controlVideoPlayer(res.concat(newdata), newindex),
    });
  },
  guanZhus(e) {
    var idx = e.detail.index
    var videoList = this.data.videoList;
    videoList.map((value, index) => {
      if (index === idx) {
        value.state = 0;
      }
    })
    this.setData({
      videoList: videoList
    })
  },
  goUP(e) {
    var state = e.detail.state;
    var username = e.detail.username;
    wx.navigateTo({
      url: '../UPDetail/UPDetail?state=' + state + '&username=' + username
    })
  },
  //上滑到第一条数据
  swipeToStart: function (e) {
    wx.showToast({
      title: '已经滑到顶部',
      icon: 'none'
    })
  },
  //点击左侧按钮
  menuTap: function (e) {
    const {
      buttontype,
      buttonname,
      itemid
    } = e.detail;
    // console.log(buttontype, buttonname, itemid);
    if (buttontype == 2) {
      this.setData({
        pinlun: true
      })
    } else if (buttontype == 1) {
      var videoList = this.data.videoList;
      videoList.map((value, index) => {
        if (index + 1 == itemid) {
          if (value.shoucang == 1) {
            value.shoucang = 0;
            wx.showToast({
              title: '取消点赞',
              icon: 'none',
              duration: 500
            })
          } else {
            value.shoucang = 1;
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 500
            })
          }
        }
      })
    }
  },

})