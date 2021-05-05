var user = require('../../../utils/user.js');
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({
  data: {
    orderList: [],
    showType: 0,
    pageNum: 1,
    pageSize: 10,
    lastPage: false,
    hasLogin: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    try {
      var tab = wx.getStorageSync('tab');

      this.setData({
        showType: tab
      });
    } catch (e) {}

  },
  getOrderList() {
    let that = this;
    util.request(api.OrderAdminList, {
      showType: that.data.showType,
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }, "POST").then(function(res) {
      if (res.errcode === '0') {
        console.log(res.data);
        that.setData({
          orderList: that.data.orderList.concat(res.data.list)
        });

        if(res.data.list.length < that.data.pageSize){
          that.data.lastPage = true
        }
      }
    });
  },
  onReachBottom() {
    if(this.data.lastPage){
      wx.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }else{
      this.setData({
        pageNum: this.data.pageNum + 1
      });
      this.getOrderList();
    }
  },
  switchTab: function(event) {
    let showType = event.currentTarget.dataset.index;
    this.setData({
      orderList: [],
      showType: showType,
      pageNum: 1,
      pageSize: 10,
      lastPage: false
    });
    this.getOrderList();
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    if (app.globalData.hasLogin) {

      if(!user.checkPermission()){
        wx.showModal({
          title: '权限',
          content: '没有权限操作',
          success: function(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        return
      }
      // 页面显示
      this.setData({
        orderList: []
      });
      this.getOrderList();
    }

    this.setData({
      hasLogin: app.globalData.hasLogin
    });
  },
  goLogin() {
    wx.navigateTo({
      url: "/pages/auth/login/login"
    });
  },
  callConsignee: function(e){
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.mobile //仅为示例，并非真实的电话号码
    })
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})