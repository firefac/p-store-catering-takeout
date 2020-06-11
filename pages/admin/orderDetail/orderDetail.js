var user = require('../../../utils/user.js');
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({
  data: {
    orderId: 0,
    orderSn: '',
    orderInfo: {},
    orderGoods: [],
    expressInfo: {},
    flag: false,
    handleOption: {},
    qrFile: undefined,
    qrShow: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.id && options.id != 0) {
      this.setData({
        orderId: options.id
      });
    }
    if (options.orderSn && options.orderSn != '') {
      this.setData({
        orderSn: options.orderSn
      });
    }

    if(this.data.orderId == null && this.data.orderSn == null){
      wx.showModal({
        title: '扫码异常',
        content: '扫码异常，请检查二维码是否正确',
        success: function(res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
      return
    }

    this.getOrderDetail();
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderDetail();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  expandDetail: function() {
    let that = this;
    this.setData({
      flag: !that.data.flag
    })
  },
  getOrderDetail: function() {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function() {
      wx.hideLoading()
    }, 2000);

    let that = this;
    util.request(api.OrderAdminDetail, {
      orderId: that.data.orderId,
      orderSn: that.data.orderSn
    }).then(function(res) {
      if (res.errcode === '0') {
        console.log(res.data);

        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.orderInfo.handleOption,
          expressInfo: res.data.expressInfo
        });
      }

      wx.hideLoading();
    });
  },
  call: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.orderInfo.ladingPoint.mobile //仅为示例，并非真实的电话号码
    })
  },
  callUser: function(){
    wx.makePhoneCall({
      phoneNumber: this.data.orderInfo.mobile //仅为示例，并非真实的电话号码
    })
  },
  // “取消订单”点击效果
  cancelOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderAdminCancel, {
            orderId: orderInfo.id
          }, 'POST').then(function(res) {
            if (res.errcode === '0') {
              wx.showToast({
                title: '取消订单成功'
              });
              that.getOrderDetail();
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “确认收货”点击效果
  confirmOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确认收货？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderAdminConfirm, {
            orderId: orderInfo.id
          }, 'POST').then(function(res) {
            if (res.errcode === '0') {
              wx.showToast({
                title: '确认收货成功！'
              });
              that.getOrderDetail();
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  showQr: function(){
    let that = this
    if(this.data.qrFile == null){
      wx.downloadFile({
        url: api.OrderGeneralQr + '?orderId=' + this.data.orderId, //仅为示例，并非真实的资源
        header: {
          "X-TOKEN":  wx.getStorageSync('token')
        },
        success (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            that.setData({
              qrFile: res.tempFilePath
            })
          }
        }
      })
    }
    this.setData({ qrShow: true });
  },
  onQrClose() {
    this.setData({ qrShow: false });
  },
  showMap() {
    wx.openLocation({
      latitude: this.data.orderInfo.ladingPoint.lat,
      longitude: this.data.orderInfo.ladingPoint.lng,
      name: this.data.orderInfo.ladingPoint.name,
      address: this.data.orderInfo.ladingPoint.region + this.data.orderInfo.ladingPoint.address,
    })
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
    }
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})