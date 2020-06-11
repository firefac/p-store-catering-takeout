//index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    storeInfo: {},
    hasLogin: false,
    adminPermission: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      storeInfo: wx.getStorageSync('storeInfo')
    })
  },
  onReady: function() {

  },
  onShow: function() {

    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });
      
      var adminPermission = false
      if (user.checkLoginSync()) {
        adminPermission = user.checkPermission()
      }
  
      this.setData({
        adminPermission: adminPermission
      })
    }

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  goAdminOrder: function(){
    if (app.globalData.hasLogin) {
      if(!user.checkPermission()){
        wx.showModal({
          title: '权限',
          content: '没有权限操作',
          success: function(res) {
          }
        })
        return
      }
    }else{
      wx.navigateTo({
        url: "/pages/auth/login/login"
      })
      return
    }

    wx.navigateTo({
      url: "/pages/admin/order/order"
    })
  },
  scanQrCode: function(){
    if (app.globalData.hasLogin) {
      if(!user.checkPermission()){
        wx.showModal({
          title: '权限',
          content: '没有权限操作',
          success: function(res) {
          }
        })
        return
      }
    }else{
      wx.navigateTo({
        url: "/pages/auth/login/login"
      })
      return
    }

    wx.scanCode({
      success (res) {
        var result = res.result
        if(result == ''){
          return
        }

        var reg = RegExp(/order:.*/);
        console.info(result)
        console.info(result.match(reg))
        console.info(result.substring(6, result.length))

        if(result.match(reg)){
          wx.navigateTo({
            url: "/pages/admin/orderDetail/orderDetail?orderSn=" + result.substring(6, result.length)
          })
        }
      }
    })
  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goCoupon() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/couponList/couponList"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goAddress() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/address/address"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.storeInfo.mobile,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (!res.confirm) {
          return;
        }

        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        app.globalData.hasLogin = false;
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    })

  }
})
