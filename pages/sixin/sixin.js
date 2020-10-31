const app = getApp()
var wtim = require('../../utils/tim.js')
//import TIM from 'tim-js-sdk';
import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
//import COS from 'cos-js-sdk-v5';
import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';
let options = {
  SDKAppID: 1400324831 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
};
let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
// tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用
Page({
  data: {
    max: 40,
    bar: false,
    add: false,
    good: true,
    values: "",
    userdata: {},
    jilu: [],
    to: 0, //消息接收人id
    isCompleted: true,
    nextReqMessageID: '',
    voiceed: true, //录音模式
    voiceText: '长按开始录音',
    storeHeadImg: 'http://img2.imgtn.bdimg.com/it/u=2435883410,1025234814&fm=26&gp=0.jpg',
    conversationID: '',
    type: 2, //2不用发送自定义消息，1发送自定义消息
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  onLoad(options) {
    wtim.login();
    var path = decodeURIComponent(options.storeimg)
    var userdata = wx.getStorageSync('user_data');
    this.setData({
      userdata: userdata,
      to: options.to,
      storeHeadImg: path,
      type: options.type,
      conversationID: 'C2C' + options.to
    })
  },
  onShow() {
    this.getHistoryMsg()

  },
  aDD() {
    this.setData({
      add: !this.data.add
    })
  },
  shuRu(e) {
    this.setData({
      values: e.detail.value
    })
  },
  //发送文字消息
  gO() {
    var that = this;
    let message = tim.createTextMessage({
      to: that.data.to,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        text: that.data.values
      }
    });
    // 2. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      var jilus = that.data.jilu;
      jilus.push(imResponse.data.message)
      // console.log(jilus)
      that.setData({
        jilu: jilus,
        values: ''
      })
      // 发送成功
      // console.log(imResponse, '......成功');
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
  //发送图片消息
  goImg() {
    var that = this;
    wx.chooseImage({
      sourceType: ['album'], // 从相册选择
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      success: function (res) {
        // 2. 创建消息实例，接口返回的实例可以上屏
        let message = tim.createImageMessage({
          to: that.data.to,
          conversationType: TIM.TYPES.CONV_C2C,
          payload: {
            file: res
          },
          onProgress: function (event) {
            console.log('file uploading:', event)
          }
        });
        // 3. 发送图片
        let promise = tim.sendMessage(message);
        promise.then(function (imResponse) {
          var jilus = that.data.jilu;
          jilus.push(imResponse.data.message)
          // console.log(jilus)
          that.setData({
            jilu: jilus,
            values: '',
            add: false
          })
          // 发送成功
          console.log(imResponse);
        }).catch(function (imError) {
          // 发送失败
          console.warn('sendMessage error:', imError);
        });
      }
    })
  },
  //发送自定义消息
  goDataMsg() {
    var that = this;
    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    var datas = wx.getStorageSync('goodDetail');
    var msgData = {
      goods_name: datas.goods.goods_name,
      goods_img: datas.goods.goods_img,
      goods_amount: datas.goods.goods_amount,
    }
    var msgDatas = JSON.stringify(msgData);
    // 2. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createCustomMessage({
      to: that.data.to,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        data: msgDatas, // 用于标识该消息是骰子类型消息
        description: String(random(1, 6)), // 获取骰子点数
        extension: ''
      }
    });
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      if (msgData.goods_img.indexOf(',') == -1) {} else {
        var imgUrls = []
        imgUrls = datas.goods_img.split(',');
        msgData.goods_img = imgUrls[0]
      }
      imResponse.data.message.payload.data = msgData
      // 发送成功
      var jilus = that.data.jilu;
      jilus.push(imResponse.data.message)
      // console.log(jilus)
      that.setData({
        jilu: jilus,
        values: ''
      })
      console.log(imResponse);
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
  //语音播放
  audioPlay: function () {
    this.audioCtx.play()
  },
  //去商品详情
  goDetail() {
    // wx.navigateTo({
    //   url: '../jiluDetail/jiluDetail'
    // })
  },
  //切换录音模式
  voices() {
    if (this.data.voiceed == true) {
      this.setData({
        voiceed: false
      })
    } else {
      this.setData({
        voiceed: true
      })
    }
  },
  //展示图片
  showImg(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.dataset.imgurl, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.imgurl] // 需要预览的图片http链接列表
    })
  },
  mytouchstart(e) { //记录触屏开始时间
    var that = this;
    const recorderManager = wx.getRecorderManager();
    // 录音部分参数
    const recordOptions = {
      duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
      sampleRate: 44100, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 192000, // 编码码率
      format: 'mp3' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
    };
    // 2.1 监听录音错误事件
    recorderManager.onError(function (errMsg) {
      console.warn('recorder error:', errMsg);
    });
    // 3. 开始录音
    recorderManager.start(recordOptions);
    that.setData({
      voiceText: '正在录音......'
    })
  },
  mytouchend(e) { //记录触屏结束时间
    var that = this;
    // 2.2 监听录音结束事件，录音结束后，调用 createAudioMessage 创建音频消息实例
    const recorderManager = wx.getRecorderManager();
    // 录音部分参数
    const recordOptions = {
      duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
      sampleRate: 44100, // 采样率
      numberOfChannels: 1, // 录音通道数
      encodeBitRate: 192000, // 编码码率
      format: 'mp3' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和 Web）互通
    };
    recorderManager.stop(recordOptions)
    that.setData({
      voiceText: '长按开始录音'
    })
    recorderManager.onStop(function (res) {
      // console.log('recorder stop', res);
      // 4. 创建消息实例，接口返回的实例可以上屏
      const message = tim.createAudioMessage({
        to: that.data.to,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          file: res
        }
      });
      // 5. 发送消息
      let promise = tim.sendMessage(message);
      promise.then(function (imResponse) {
        var jilus = that.data.jilu;
        jilus.push(imResponse.data.message)
        // console.log(jilus)
        that.setData({
          jilu: jilus,
          values: ''
        })
        // 发送成功
        console.log(imResponse);
      }).catch(function (imError) {
        // 发送失败
        console.warn('sendMessage error:', imError);
      });
    });
  },
  //
  //第一次获取历史消息
  getHistoryMsg() {
    var that = this;
    let promise = tim.getMessageList({
      conversationID: 'C2C' + that.data.to,
      count: 10
    });
    promise.then(function (imResponse) {
      // console.log(imResponse);
      const messageList = imResponse.data.messageList; // 消息列表。
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      for (var i = 0; i < messageList.length; i++) {
        if (messageList[i].payload.data) {
          if (typeof (messageList[i].payload.data) == 'string') {
            var obj = JSON.parse(messageList[i].payload.data);
            messageList[i].payload.data = {
              goods_img: obj.goods_img,
              goods_amount: obj.goods_amount * 1,
              goods_name: obj.goods_name,
              goods_id: obj.goods_id,
            }
            if (messageList[i].payload.data.goods_img.indexOf(',') == -1) {} else {
              var imgurl = messageList[i].payload.data.goods_img.split(',');
              messageList[i].payload.data.goods_img = imgurl[0]
            }
          }
        }
      }
      that.setData({
        jilu: messageList,
        isCompleted: isCompleted,
        nextReqMessageID: nextReqMessageID
      })
      if (that.data.type == 1) {
        that.goDataMsg()
      }
      that.getNewMsg()
    });
  },
  //下拉刷新
  onPullDownRefresh() {
    if (this.data.isCompleted == false) {
      this.getMoreHistoryMsg()
    }
  },
  //获取更多历史消息
  getMoreHistoryMsg() {
    var that = this;
    var nextReqMessageID = that.data.nextReqMessageID;
    let promise = tim.getMessageList({
      conversationID: 'C2C' + that.data.to,
      nextReqMessageID,
      count: 10
    });
    promise.then(function (imResponse) {
      wx.stopPullDownRefresh(); //停止下拉刷新
      // console.log(imResponse)
      const messageList = imResponse.data.messageList; // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      for (var i = 0; i < messageList.length; i++) {
        if (messageList[i].payload.data) {
          if (typeof (messageList[i].payload.data) == 'string') {
            var obj = JSON.parse(messageList[i].payload.data);
            messageList[i].payload.data = {
              goods_img: obj.goods_img,
              goods_amount: obj.goods_amount * 1,
              goods_name: obj.goods_name,
              goods_id: obj.goods_id,
            }
            if (messageList[i].payload.data.goods_img.indexOf(',') == -1) {} else {
              var imgurl = messageList[i].payload.data.goods_img.split(',');
              messageList[i].payload.data.goods_img = imgurl[0]
            }
          }
        }
      }
      var jilus = that.data.jilu;
      that.setData({
        jilu: messageList.concat(jilus),
        isCompleted: isCompleted,
        nextReqMessageID: nextReqMessageID
      })
    })
    
  },
  //接收最新消息
  getNewMsg() {
    var that = this;
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function onMessageReceived(event) {
      var data = event.data;
      // console.log(data)
      for (var i = 0; i < data.length; i++) {
        if (that.data.conversationID == data[i].conversationID) {
          var jilus = that.data.jilu;
          jilus.push(data[i])
          that.setData({
            jilu: jilus
          })
        }
      }
    });
  }
})