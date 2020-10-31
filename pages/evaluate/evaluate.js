const app = getApp()

Page({
  data: {
    good: {
      img: "http://img4.imgtn.bdimg.com/it/u=2250800750,2031167450&fm=26&gp=0.jpg",
      name: "SK-II 护肤精华露（神仙水®）",
      text: '容量：230ml',
      num: 1,
      price: '1450'
    },
    select: [1, 2, 3, 4, 5, 6],
    style: "10",
    starIndex1: 0,
    starIndex2: 0,
    starIndex3: 0,
  },
  onLoad() {

  },
  //选择评价语
  select(e) {
    this.setData({
      style: e.currentTarget.dataset.index,
    })
  },
  //星星评分
  onChange(e) {
    var index = e.detail.index;
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        starIndex1: index
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        starIndex2: index
      })
    } else {
      this.setData({
        starIndex3: index
      })
    }

  },
})