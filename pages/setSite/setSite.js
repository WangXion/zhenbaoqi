//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    province_list: null,
    province_name: null,
    city_list: null,
    city_name: null,
    area_list: null,
    area_name: null,
    addressCity: null,
    multiArray: [], // 三维数组数据
    multiIndex: [0, 0, 0], // 默认的下标,
    selectProvinceId: null,
    selectCityId: null,
    selectAreaId: null,
    phoneNum: '',
    peopleName: '',
    textCounter: '',
    switch1Checked: false,
    switchs: 0,
    asdid: 0,
    state: 1,
    sitename: ''
  },
  onLoad(options) {
    console.log(options)
    this.getProvince()
    if (options.state == 1) {
      this.setData({
        state: 1
      })
      wx.setNavigationBarTitle({
        title: '添加收货地址'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
      if (options.default == 1) {
        this.setData({
          switch1Checked: false,
          switchs: 1
        })
      } else {
        this.setData({
          switch1Checked: true,
          switchs: 0
        })
      }
      this.setData({
        phoneNum: options.phone,
        textCounter: options.address,
        peopleName: options.name,
        asdid: options.asdid,
        state: 2,
        sitename: decodeURIComponent(options.sitename),
        selectProvinceId: options.provinceid,
        selectCityId:options.cityid,
        selectAreaId:options.countyid,
      })
    }
  },
  //收件人名字
  name(e) {
    this.setData({
      peopleName: e.detail.value
    })
  },
  //收件人手机号
  phone(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },

  //文本框
  textareas(e) {
    var that = this;
    if (5 <= e.detail.cursor <= 300) {
      that.setData({
        textCounter: e.detail.value,
      })
    }
  },
  //是否为默认
  switch1Change(e) {
    // console.log(e)
    if (e.detail.value == false) {
      this.setData({
        switchs: 1
      })
    } else {
      this.setData({
        switchs: 0
      })
    }
    this.setData({
      switch1Checked: e.detail.value
    })
  },
  //添加修改
  submit() {
    //  console.log(this.data.selectProvinceId, this.data.selectCityId, this.data.selectAreaId)
    var that = this;
    var token = wx.getStorageSync('token');

    
    if (that.data.peopleName == '' || undefined || null) {
      wx.showToast({
        title: '请填写收件人姓名',
        icon: 'none'
      })
    } else if (that.data.phoneNum.length < 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    } else if (that.data.textCounter.length < 5) {
      wx.showToast({
        title: '详细地址太短',
        icon: 'none'
      })
    } else if (that.data.selectProvinceId == null) {
      wx.showToast({
        title: '请选择所在省份',
        icon: 'none'
      })
    } else if (that.data.selectCityId == null) {
      wx.showToast({
        title: '请选择所在城市',
        icon: 'none'
      })
    } else if (that.data.selectAreaId == null) {
      wx.showToast({
        title: '请选择所在市区',
        icon: 'none'
      })
    } else {
      if (that.data.state == 1) {
        wx.request({
          url: 'https://www.zbq888.cn/api/v1/user/address/add',
          method: 'post',
          data: {
            "address": that.data.textCounter,
            "city_id": that.data.selectCityId,
            "consignee": that.data.peopleName,
            "county_id": that.data.selectAreaId,
            "is_default": that.data.switchs,
            "phone_no": that.data.phoneNum,
            "province_id": that.data.selectProvinceId
          },
          header: {
            'content-type': 'application/json',
            "client": 1,
            'token': token
          },
          success(res) {
            // console.log(res)
            if (res.data.mark == 0) {
              wx.showToast({
                title: '添加成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  url: '../site/site'
                })
              }, 1000)
            }
          },
          fail(res) {
            console.log(res);
          }
        })
      } else {
        wx.request({
          url: 'https://www.zbq888.cn/api/v1/user/address/update',
          method: 'post',
          data: {
            "address": that.data.textCounter,
            "city_id": that.data.selectCityId,
            "consignee": that.data.peopleName,
            "county_id": that.data.selectAreaId,
            "is_default": that.data.switchs,
            "phone_no": that.data.phoneNum,
            "province_id": that.data.selectProvinceId,
            "ads_id": that.data.asdid
          },
          header: {
            'content-type': 'application/json',
            "client": 1,
            'token': token
          },
          success(res) {
            // console.log(res)
            if (res.data.mark == 0) {
              wx.showToast({
                title: '修改成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  url: '../site/site'
                })
              }, 1000)
            }
          },
          fail(res) {
            console.log(res);
          }
        })
      }

    }
  },
  //获取省份列表
  getProvince() {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/dict/list',
      method: 'post',
      data: {
        "code_type": "province"
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        // console.log(res)
        var provinceList = [...res.data.dicts] //放到一个数组里面
        var provinceArr = res.data.dicts.map((item) => {
          return item.code_name
        }) //获取名称
        that.setData({
          multiArray: [provinceArr, [],
            []
          ], //更新三维数组  更新完为[['广东','北京'],[],[]]
          province_list: provinceList, //省级原始数据
          province_name: provinceArr, //省级全部名称
        })
        var defaultCode = that.data.province_list[0].dict_id //使用第一项当作参数获取市级数据
        if (defaultCode) {
          that.setData({
            currnetProvinceId: defaultCode //保存当前省份id
          })
          that.getCity(defaultCode) //获取市区数据
        }
      }
    })
  },
  //根据省份id获取城市
  getCity(id) {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      currnetProvinceId: id
    })
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/dict/son/list',
      method: 'post',
      data: {
        parent_id: id
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        // console.log(res)
        var cityArr = res.data.dicts.map((item) => {
          return item.code_name
        }) //返回城市名称
        var cityList = [...res.data.dicts]
        that.setData({
          multiArray: [that.data.province_name, cityArr, []], //更新后[['广东','北京'],['潮州'，'汕头','揭阳'],[]]
          city_list: cityList, //保持市级数据
          city_name: cityArr //市级名称
        })
        var defaultCode = that.data.city_list[0].dict_id //获取第一个市的区级数据
        if (defaultCode) {
          that.setData({
            currentCityId: defaultCode //保存当下市id
          })
          that.getArea(defaultCode) //获取区域数据
        }
      }
    })
  },
  //获取区域
  getArea(id) {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      currentCityId: id //保存当前选择市
    })
    wx.request({
      url: 'https://www.zbq888.cn/api/v1/dict/son/list',
      method: 'post',
      data: {
        parent_id: id
      },
      header: {
        'content-type': 'application/json', // 默认值
        "client": 1,
        'token': token
      },
      success(res) {
        // console.log(res)
        var areaList = [...res.data.dicts]
        var areaArr = res.data.dicts.map((item) => {
          return item.code_name
        }) //区域名
        that.setData({
          multiArray: [that.data.province_name, that.data.city_name, areaArr],
          area_list: areaList, //区列表
          area_name: areaArr //区名字
        })

      }
    })
  },
  //picker确认选择地区
  bindRegionChange: function (e) {
    // 因为在获取省中 北京只有一个选项，导致获取不了北京》北京》第一个
    if (e.detail.value[1] == null || e.detail.value[2] == null) { //如果只滚动了第一列则选取第一列的第一数据
      this.setData({
        multiIndex: e.detail.value, //更新下标
        addressCity: [this.data.province_list[e.detail.value[0]].code_name, this.data.city_list[0].code_name, this.data.area_list[0].code_name],
        selectProvinceId: this.data.province_list[e.detail.value[0]].dict_id,
        selectCityId: this.data.city_list[0].dict_id,
        selectAreaId: this.data.area_list[0].dict_id
      })
    } else {
      this.setData({
        multiIndex: e.detail.value, //更新下标
        addressCity: [this.data.province_list[e.detail.value[0]].code_name, this.data.city_list[e.detail.value[1]].code_name, this.data.area_list[e.detail.value[2]].code_name],
        selectProvinceId: this.data.province_list[e.detail.value[0]].dict_id,
        selectCityId: this.data.city_list[e.detail.value[1]].dict_id,
        selectAreaId: this.data.area_list[e.detail.value[2]].dict_id
      })
    }
    // console.log(this.data.selectProvinceId, this.data.selectCityId, this.data.selectAreaId)
  },
  //滑动地区组件
  bindRegionColumnChange: function (e) {
    // console.log(e.detail.column,e.detail.value)
    var that = this
    var column = e.detail.column //当前改变的列
    var data = {
      multiIndex: JSON.parse(JSON.stringify(that.data.multiIndex)),
      multiArray: JSON.parse(JSON.stringify(that.data.multiArray))
    }
    data.multiIndex[column] = e.detail.value //第几列改变了就是对应multiIndex的第几个，更新他
    switch (column) {
      case 0: //第一列改变，省级改变
        var currentProvinceId = that.data.province_list[e.detail.value].dict_id
        if (currentProvinceId != that.data.currentProvinceId) { //判断当前id是不是更新了
          that.getCity(currentProvinceId) //获取当前id下的市级数据
        }
        data.multiIndex[1] = 0 //将市默认选择第一个
        break
      case 1: //第二列改变，市级改变
        var currentCityId = that.data.city_list[e.detail.value].dict_id
        if (currentCityId != that.data.currentCityId) {
          that.getArea(currentCityId) //获取区域
        }
        data.multiIndex[2] = 0 //区域默认第一个
        break
    }
    that.setData(data) //更新数据
  },
})