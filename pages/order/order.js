//index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    orderList: [],
    showType: 0,
    pageNum: 1,
    pageSize: 10,
    lastPage: false

  },
  

  onLoad: function(options) {

  },
  getOrderList() {
    let that = this;
    util.request(api.OrderList, {
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
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.setData({
      orderList: [],
      pageNum: 1,
      lastPage: false
    });
    this.getOrderList();

    var refreshIndexCart = wx.getStorageSync('refreshIndexCart');
    if (refreshIndexCart === 1) {
      wx.hideTabBarRedDot({
        index: 1
      })
    }
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      orderList: [],
      pageNum: 1,
      lastPage: false
    });
    this.getOrderList()
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }

})
