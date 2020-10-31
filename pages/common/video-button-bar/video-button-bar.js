// components/video-button-bar.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    shoucang: {
      type: Number,
      observer(newVal, oldVal) {
        console.log(oldVal)
        console.log(newVal)
        this.setData({
          shoucangs: newVal
        })
      }
    },
    typeid: Number,


  },

  /**
   * 组件的初始数据
   */
  data: {
    shoucangs: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toolBarButton: function (e) {
      const {
        buttontype,
        buttonname,
        itemid
      } = e.currentTarget.dataset;
      //控制点赞图片变化
      if (buttontype == 1) {
        if (this.data.shoucangs == 1) {
          this.setData({
            shoucangs: 0
          })
        } else {
          this.setData({
            shoucangs: 1
          })
        }
      }
      this.triggerEvent('buttonhandle', {
        buttontype,
        buttonname,
        itemid
      });
    }
  }
})