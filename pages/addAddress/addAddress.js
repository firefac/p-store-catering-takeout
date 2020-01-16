var app = getApp();
var QQMapWX = require('../../qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    id: '先生',
    city: '点击选择',
    name: '',
    phone: '',
    cityDetail: '',
    address: '',   //当前定位的城市
    nothing: false
  },
  getAddress: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        if (res.address.length > 10) {
          res.address = res.address.substr(0, 10) + '...'
        }
        that.setData({
          city: res.address
        })
      },
    })
  },
  chooseId: function(e) {
    var type = e.currentTarget.dataset.id;
    this.setData({
      id: type
    })
  },
  toEditAddress: function() {
    this.setData({
      pageType: 2
    })
  },
  noChoose: function() {
    this.setData({
      pageType: 1,
      city: '点击选择',
    })
  },
  setName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  setPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setCityDetail: function(e) {
    this.setData({
      cityDetail: e.detail.value
    })
  },
  // saveAddress: function() {
  //   console.log(this.data)
  //   wx.navigateBack({
  //     url: '../address/address',
  //   })   
  //   wx.request({
  //     url: '',
  //     data: this.data,
  //     success: function(res) {
  //       console.log(res)
  //     }
  //   })
  // },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  }
})