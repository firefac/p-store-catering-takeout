var app = getApp();
Page({
  data: {
    windowHeight: 654,
    maxtime: "",
    isHiddenLoading: true,
    isHiddenToast: true,
    dataList: {},
    countDownMinute: 0,
    countDownSecond: 0,
  },
  //事件处理函数  
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      windowHeight: wx.getStorageSync('windowHeight')
    });
  },

  // 页面渲染完成后 调用  
  onReady: function () {
    var totalSecond = app.globalData.totalSecond;

    var interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;

      // 分钟位  
      var min = Math.floor((second) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
      app.globalData.totalSecond = totalSecond;
    }.bind(this), 1000);
  },

  //cell事件处理函数  
  bindCellViewTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../babyDetail/babyDetail?id=' + id
    });
  },
  to: function() {
    wx.redirectTo({
      url: '../index/index',
    })
  }
})  