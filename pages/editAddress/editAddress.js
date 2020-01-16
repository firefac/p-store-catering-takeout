var app = getApp();
var QQMapWX = require('../../qqmap-wx-jssdk.min.js');
var qqmapsdk;

Page({
  data: {
    address: '',
    nothing: false
  },
  onLoad: function () {
    // 实例化API核心类
    // qqmapsdk = new QQMapWX({
    //   key: 'SJ2BZ-OPJWF-4CYJA-JW7NJ-JYHUQ-BEFMX'
    // });
    wx.chooseLocation({
      success: function(res) {
        
      },
    })
  }, 
  input: function (e) {
    var that = this;
    // 调用接口
    qqmapsdk.search({
      keyword: e.detail.value,
      page_size: 100,
      success: function (res) {
        if(res.data == '') {
          that.setData({
            locationList: res.data,
            nothing: true
          })
        }else {
          that.setData({
            locationList: res.data,
            nothing: false
          })
        }        
      },
      fail: function (res) {
        
      },
      complete: function (res) {
        
      }
    });
  },
  noChoose: function (e) {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  back: function(e) {
    var data = e.target.dataset.key
    app.globalData.address = data;
    wx.redirectTo({
      url: '../index/index',
    })
  }
  
})