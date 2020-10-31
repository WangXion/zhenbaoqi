const app = getApp()
var tim = require('../../utils/tim.js')
//import TIM from 'tim-js-sdk';
import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
//import COS from 'cos-js-sdk-v5';
import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';
let options = {
  SDKAppID: 1400324831 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
};
let wtim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
// tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
wtim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用
Page({
  data: {
    current: "tab1",
    state: 1,
    page: 1,
    contactList: [], //聊天列表
    notice: '暂无最新消息',
    change_message_size: 2,
    courier_message_size: 0,
    system_message_size: 0,
    change_message: '',
    courier_message: '',
    system_message: '',
    loginState: 0, //0未登录，1登录
    user_data: {}, //用户信息
  },
  onLoad() {
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
  onShow() {
    if (wx.getStorageSync('user_data')) {
      var data = wx.getStorageSync('user_data');
      this.setData({
        user_data: data
      })
    }

    if (wx.getStorageSync('userSig')) {
      this.getSiXinList()
    }
  },
  //去私信
  goSixin(e) {
    var storeimg = encodeURIComponent(e.currentTarget.dataset.storeimg);
    wx.navigateTo({
      url: '../sixin/sixin?type=2&conversationID=' + e.currentTarget.dataset.conversationid + '&to=' + e.currentTarget.dataset.userid + '&storeimg=' + storeimg
    })
    wx.setStorageSync('conversationid', e.currentTarget.dataset.conversationid);
  },
  //去消息列表
  goList(e) {
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../messageList/messageList?type=' + type
    })
  },

  //去在线客服
  goKefu() {
    wx.navigateTo({
      url: '../kefu/kefu'
    })
  },
  //获取消息列表
  getMessageList() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/message/size',
      method: 'post',
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        "token": token
      },
      success(res) {
        that.setData({
          // change_message_size: res.data.change_message_size,
          // courier_message_size: res.data.courier_message_size,
          // system_message_size: res.data.system_message_size,
          // change_message: res.data.change_message,
          // courier_message: res.data.courier_message,
          // system_message: res.data.system_message
        })
      }
    })
  },
  //去登录页
  goLogin() {
    wx.reLaunch({
      url: '../login/login'
    })
  },
  //获取私信消息列表
  getSiXinList() {
    tim.login()
    var that = this;
    let promise = wtim.getConversationList();
    promise.then(function (imResponse) {
      // console.log(imResponse)
      const list = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
      function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
      }
      for (var i = 0; i < list.length; i++) {
        var time = timestampToTime(list[i].lastMessage.lastTime)
        //  console.log(time)
        list[i].lastMessage.lastTime = time
      }
      that.setData({
        contactList: list
      })
      that.getNewMsg()
      wx.getStorageSync('TIM_1400324831_' + that.data.user_data.user_id + '_conversationMap', list)
    }).catch(function (imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
  },
  //接收最新消息
  getNewMsg() {
    var that = this;
    var list = wx.getStorageSync('TIM_1400324831_' + that.data.user_data.user_id + '_conversationMap')
    // console.log(list)
    wtim.on(TIM.EVENT.MESSAGE_RECEIVED, function onMessageReceived(event) {
      function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
      }
      var data = event.data;
      // console.log(data)
      for (var i = 0; i < data.length; i++) {
        for (var s = 0; s < list.length; s++) {
          if (data[i].conversationID == list[s].conversationID) {
            var time = timestampToTime(data[i].time)
            list[s].lastMessage.lastTime = time
            if (data[i].type == "TIMTextElem") {
              list[s].lastMessage.messageForShow = data[i].payload.text
            } else if (data[i].type == "TIMSoundElem") {
              list[s].lastMessage.messageForShow = '[语音]'
            } else if (data[i].type == "TIMImageElem") {
              list[s].lastMessage.messageForShow = '[图片]'
            } else if (data[i].type == "TIMCustomElem") {
              list[s].lastMessage.messageForShow = "[自定义消息]"
            }
          }
        }
      }
      that.setData({
        contactList: list
      })
    });
  }
})