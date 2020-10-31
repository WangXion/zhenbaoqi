//import TIM from 'tim-js-sdk';
import TIM from 'tim-wx-sdk'; // 微信小程序环境请取消本行注释，并注释掉 import TIM from 'tim-js-sdk';
//import COS from 'cos-js-sdk-v5';
import COS from 'cos-wx-sdk-v5'; // 微信小程序环境请取消本行注释，并注释掉 import COS from 'cos-js-sdk-v5';

// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
let options = {
    SDKAppID: 1400324831 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
};
let tim = TIM.create(options); // SDK 实例通常用 tim 表示
// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
// tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

// 将腾讯云对象存储服务 SDK （以下简称 COS SDK）注册为插件，IM SDK 发送文件、图片等消息时，需要用到腾讯云的 COS 服务
// HTML5 环境，注册 COS SDK
// tim.registerPlugin({
//     'cos-js-sdk': COS
// });

// 微信小程序环境，注册 COS SDK
tim.registerPlugin({
    'cos-wx-sdk': COS
}); // 微信小程序环境请取消本行注释，并注释掉 tim.registerPlugin({'cos-js-sdk': COS});

// 监听事件，如：
tim.on(TIM.EVENT.SDK_READY, function (event) {
    // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
    // event.name - TIM.EVENT.SDK_READY00000000
});

tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    // event.name - TIM.EVENT.MESSAGE_RECEIVED
    // event.data - 存储 Message 对象的数组 - [Message]
});

tim.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
    // 收到消息被撤回的通知。使用前需要将SDK版本升级至v2.4.0或以上。
    // event.name - TIM.EVENT.MESSAGE_REVOKED
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
});

tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
    // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
    // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
    // event.data - 存储 Conversation 对象的数组 - [Conversation]
});

tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
    // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
    // event.name - TIM.EVENT.GROUP_LIST_UPDATED
    // event.data - 存储 Group 对象的数组 - [Group]
});

tim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
    // 收到自己或好友的资料变更通知
    // event.name - TIM.EVENT.PROFILE_UPDATED
    // event.data - 存储 Profile 对象的数组 - [Profile]
});

tim.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
    // 收到黑名单列表更新通知
    // event.name - TIM.EVENT.BLACKLIST_UPDATED
    // event.data - 存储 userID 的数组 - [userID]
});

tim.on(TIM.EVENT.ERROR, function (event) {
    // 收到 SDK 发生错误通知，可以获取错误码和错误信息
    // event.name - TIM.EVENT.ERROR
    // event.data.code - 错误码
    // event.data.message - 错误信息
});

tim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
    // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    // event.name - TIM.EVENT.SDK_NOT_READY
});

tim.on(TIM.EVENT.KICKED_OUT, function (event) {
    // 收到被踢下线通知
    // event.name - TIM.EVENT.KICKED_OUT
    // event.data.type - 被踢下线的原因，例如 :
    //   - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
    //   - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
    //   - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢（v2.4.0起支持）。
});

tim.on(TIM.EVENT.NET_STATE_CHANGE, function (event) {
    // 网络状态发生改变（v2.5.0 起支持）。
    // event.name - TIM.EVENT.NET_STATE_CHANGE
    // event.data.state 当前网络状态，枚举值及说明如下：
    //   - TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
    //   - TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
    //   - TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
});

// 开始登录
function login() {
    var userdata = wx.getStorageSync('user_data');
    var userdsig = wx.getStorageSync('userSig');
    let promise = tim.login({
        userID: userdata.user_id + '',
        userSig: userdsig
    })
    promise.then(function (imResponse) {
        console.log('========>>成功'); // 登录成功
        if (imResponse.data.repeatLogin === true) {
            // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
            console.log(imResponse.data.errorInfo);
        }
    }).catch(function (imError) {
        console.warn('login error:', imError); // 登录失败的相关信息
    });
}
//获取会话列表
function getMessageLists() {
    tim.on(TIM.EVENT.SDK_READY, function getMessageList() {
        let promise = tim.getConversationList();
        promise.then(function (imResponse) {
            console.log(imResponse)
            const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
            wx.setStorageSync('TIM_1400324831_100171_conversationMap', conversationList)
        }).catch(function (imError) {
            console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
        });
    })
}
module.exports = {
    login: login,
    getMessageLists: getMessageLists,
}