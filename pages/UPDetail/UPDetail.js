//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '',
    state: '',
    img: 'https://p3.pstatp.com/large/43700001e49d85d3ab52',
    text: '这个人太懒了~'
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      name: options.username,
      state: options.state
    })
  },
  guanzhu(){
    if(this.data.state==1){
      this.setData({
        state:0
      })
    }else{
      this.setData({
        state:1
      })
    }
   
  }
})