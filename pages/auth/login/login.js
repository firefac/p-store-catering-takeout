var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  wxLogin: function(e) {
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败');
      return;
    }

    user.checkLogin().catch(() => {

      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;

        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
      });

    });
  },
  wxLogin2: function(e) {
		let that = this
		wx.getUserProfile({
			desc:'用于信息的展示和推荐',
		  success: function(res) {
		    if (res.userInfo == undefined) {
		      app.globalData.hasLogin = false;
		      util.showErrorToast('微信登录失败');
		      return;
		    }
		    
		    if(user.checkLoginSync()){
		      var pages = getCurrentPages();
		      if(pages.length == 1){
		        wx.switchTab({
		          url: '/pages/index/index',
		        })
		        return
		      }
		    
		      wx.navigateBack({
		        delta: 1
		      })
		    }else{
		      user.loginByWeixin(res.userInfo).then(res => {
		        app.globalData.hasLogin = true;
		    
		        wx.navigateBack({
		          delta: 1
		        })
		      }).catch((err) => {
		        console.log(err);
		        app.globalData.hasLogin = false;
		        util.showErrorToast('微信登录失败');
		      });
		    }
		  }
		})
  },
  accountLogin: function() {
    wx.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  }
})