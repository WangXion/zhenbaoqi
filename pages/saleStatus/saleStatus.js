//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    order_number:'',
    detail:{},
    imgUrls:[],
    state:''
  },
  onLoad(options) {
    this.setData({
  order_number: options.order_number
})
this.getStatus(options.order_number)

},
  //获取售后结果
getStatus(order_number){
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/user/order/after/detail',
      method: 'post',
      data: {
        "order_number":order_number
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        console.log(res)
        if(res.data.after_img.indexOf(',')==-1){
          var imgUrls = [];
          imgUrls.push(res.data.after_img)
          that.setData({
            imgUrls:imgUrls
          })
        }else{
          var imgUrls = res.data.after_img.split(',')
          that.setData({
            imgUrls:imgUrls
          })
        }
        if(res.data.after_state==1){
          that.data.state='等待卖家审核'
        }else if(res.data.after_state==2){
          that.data.state='卖家同意'
        }else if(res.data.after_state==3){
          that.data.state='卖家拒绝'
        }else if(res.data.after_state==4){
          that.data.state='等待卖家签收 '
        }else if(res.data.after_state==5){
          that.data.state='售后已被卖家拒绝2次'
        }else if(res.data.after_state==6){
          that.data.state='已完成'
        }else if(res.data.after_state==7){
          that.data.state='拒绝签收（售后失败）'
        }else if(res.data.after_state==8){
          that.data.state='已取消'
        }
        that.setData({
          detail:res.data
        })
      }})
  },
})