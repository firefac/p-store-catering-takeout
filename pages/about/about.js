// about.js
var app = getApp()
var util = require("../../utils/util.js");
var WxParse = require('../../lib/wxParse/wxParse.js');
var api = require("../../config/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    about: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function(options) {
      this.getAboutInfo();
  },
  // 获取商品信息
  getAboutInfo: function() {
    let that = this;
    util.request(api.SnsAboutDetail, {
      id: that.data.id
    }, "POST").then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          about: res.data
        });

        WxParse.wxParse('detail', 'html', res.data.content, that);
        
      }
    });
  }
})