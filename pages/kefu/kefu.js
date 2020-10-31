const app = getApp();
//var webim = require('../../utils/webim_wx.js');

Page({
  data: {
    time: '',
    tip: '',
    max: "40",
    bar: false,
    add: false,
    values: "",
    jilu: [{
      type: 'kf',
      counte: '您好，请问有什么可以帮助您的，如未解决您的问 题，请咨询人工客服',
      img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52'
    }]
  },
  onLoad() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    var n = timestamp * 1000;
    var date = new Date(n);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var currentTime = Y + "-" + M + "-" + D + " " + h + ":" + m;
    this.setData({
      time: currentTime,
      tip: '您好，智能客服助手为您服务！',
    });

    // //用户信息对象
    // var loginInfo = {
    //   'sdkAppID': 1400324831, //用户标识接入SDK的应用ID，必填。（这个可以在腾讯云的后台管理看到）
    //   'appIDAt3rd': 1400324831, //App 用户使用 OAuth 授权体系分配的 Appid，必填    （这个其实和上面那个是一样的）
    //   'identifier': 13453408174, //用户帐号，必填   （这个就是自己服务器里，每个用户的账号，可以自己设置）
    //   'identifierNick': "13453408174", //用户昵称，选填   (这个填不填都没什么问题，但是我个人觉得，聊天嘛，还是得有一个网名)
    //   'accountType': 12345, //账号类型，必填   (这个可以在后台管理看到，但是腾讯的文档上是没有这个的！！！但是这个必须填，不填不报错）
    //   'userSig': '1' //鉴权 Token，identifier 不为空时，必填   我觉得这个也是必填的，这个需要在一开始就从后端获取。
    // }
    // //事件回调对象 监听事件
    // var listeners = {
    //   "onConnNotify": onConnNotify, //监听连接状态回调变化事件,必填
    //   "onMsgNotify": onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    // };
    // //1v1单聊的话，一般只需要 'onConnNotify' 和 'onMsgNotify'就行了。
    // //监听连接状态回调变化事件
    // var onConnNotify = function (resp) {
    //   var info;
    //   switch (resp.ErrorCode) { //链接状态码
    //     case tim.CONNECTION_STATUS.ON:
    //       webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
    //       break;
    //     case webim.CONNECTION_STATUS.OFF:
    //       info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
    //       alert(info);
    //       webim.Log.warn(info);
    //       break;
    //     case webim.CONNECTION_STATUS.RECONNECT:
    //       info = '连接状态恢复正常: ' + resp.ErrorInfo;
    //       alert(info);
    //       webim.Log.warn(info);
    //       break;
    //     default:
    //       webim.Log.error('未知连接状态: =' + resp.ErrorInfo); //错误信息
    //       break;
    //   }
    // };

    // //监听新消息事件     注：其中参数 newMsgList 为 tim.Msg 数组，即 [tim.Msg]。
    // //newMsgList 为新消息数组，结构为[Msg]
    // function onMsgNotify(newMsgList) {
    //   //console.warn(newMsgList);
    //   var sess, newMsg;
    //   //获取所有聊天会话
    //   var sessMap = webim.MsgStore.sessMap();
    //   for (var j in newMsgList) { //遍历新消息
    //     newMsg = newMsgList[j];
    //     if (newMsg.getSession().id() == selToID) { //为当前聊天对象的消息
    //       selSess = newMsg.getSession();
    //       //在聊天窗体中新增一条消息
    //       //console.warn(newMsg);
    //       addMsg(newMsg);
    //     }
    //   }
    //   //消息已读上报，以及设置会话自动已读标记
    //   webim.setAutoRead(selSess, true, true);
    //   for (var i in sessMap) {
    //     sess = sessMap[i];
    //     if (selToID != sess.id()) { //更新其他聊天对象的未读消息数
    //       updateSessDiv(sess.type(), sess.id(), sess.unread());
    //     }
    //   }
    // };
    // var isAccessFormalEnv = true; //是否访问正式环境
    // var isLogOn = false; //是否开启sdk在控制台打印日志
    // var options = {
    //   'isAccessFormalEnv': isAccessFormalEnv, //是否访问正式环境，默认访问正式，选填
    //   'isLogOn': isLogOn //是否开启控制台打印日志,默认开启，选填
    // }
    // webim.login(loginInfo, listeners, options, function (resp) {
    //   console.log("登录成功------------------", resp)
    // }, function (err) {
    //   console.log("登录失败------------------", err.ErrorInfo)
    // })
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
  gO() {
    var user_data = wx.getStorageSync('user_data');
    var jilu = this.data.jilu;
    var add = {
      img: user_data.head_img,
      counte: this.data.values,
      type: "mine"
    }
    jilu.push(add);
    this.setData({
      jilu: jilu,
      values: ''
    })
  }

})