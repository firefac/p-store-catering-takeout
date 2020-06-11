var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    ladingPoints: [],
    total: 0,
    ladingPoint: {},
    latitude: 23.099994,
    longitude: 113.324520,    
    markers: [{
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }]
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getAddressList();
  },
  getAddressList() {
    let that = this;
    util.request(api.OrderLadingList).then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          ladingPoints: res.data
        });
      }
    });
  },
  checkLadingPoint(event) {
    let ladingPoint = event.currentTarget.dataset.ladingPoint

    var ladingPoints = this.data.ladingPoints
    ladingPoints.forEach(e => {
      if(e.id == ladingPoint.id){
        e.checked = true
      }else{
        e.checked = false
      }
    });

    var markers =[{
      id: 0,
      latitude: ladingPoint.lat,
      longitude: ladingPoint.lng,
      width: 50,
      height: 50
    }];

    this.setData({
      latitude: ladingPoint.lat,
      longitude: ladingPoint.lng,
      ladingPoints: ladingPoints,
      ladingPoint: ladingPoint,
      markers: markers
    })
  },
  confirm(event) {
    //返回之前，先取出上一页对象，并设置addressId
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    if (prevPage.route == "pages/checkout/checkout") {
      try {
        wx.setStorageSync('ladingPointId', this.data.ladingPoint.id);
      } catch (e) {

      }

      let ladingPointId = this.data.ladingPoint.id;
      if (ladingPointId && ladingPointId != 0) {
        wx.navigateBack();
      }
    }
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.detail.markerId)
  },
  controltap(e) {
    console.log(e.detail.controlId)
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})