var app = getApp();
Page({
  data: {
    foodtype: 0,
    num: 0,
    buycar_num: 0,
    totalMoney: 0,
    block: false,
    price: 12.43,
    arr: [
      { id: 0, value: "香辣味"},
      { id: 1, value: "盐焗味"},
      { id: 2, value: "蒜香味"},
      { id: 3, value: "姜葱味"},
    ]
  },
  onLoad: function() {
    this.setData({
      buycar_num: app.globalData.buycar_num,
      totalMoney: app.globalData.totalMoney
    })
  },
  resetNum: function (e) {
    var type = e.currentTarget.dataset.id;
    this.setData({
      foodtype: type
    })
  },
  reduce: function() {
    if(this.data.num>0){
      app.globalData.buycar_num--;
      app.globalData.totalMoney -= this.data.price;
      var totalMoney = app.globalData.totalMoney.toFixed(2)
      this.setData({
        num: this.data.num-1,
        buycar_num: app.globalData.buycar_num,
        totalMoney: totalMoney
      })
    }
  },
  add: function () {
    app.globalData.buycar_num++;
    app.globalData.totalMoney += this.data.price;
    var totalMoney = app.globalData.totalMoney.toFixed(2)
    this.setData({
      num: this.data.num+1,
      buycar_num: app.globalData.buycar_num,
      totalMoney: totalMoney
    })
  },
  close: function() {
    this.setData({
      block: false
    })
  },
  open: function () {
    this.setData({
      block: true
    })
  },
  submit: function() {
    var that = this;
    var i = this.data.foodtype;
    var id;  //哪种食物
    wx.request({
      url: '', 
      data: {
        type: that.data.arr[i].value,
        num: that.data.num
      },
      success: function (res) {
        that.setData({
          block: false
        })
        console.log(res.data)
      }
    })
  },
  buyNow: function() {
    wx.navigateTo({
      url: '../submitOrder/submitOrder'
    })
  },
  toAllEvaluate: function() {
    wx.navigateTo({
      url: '../allEvaluate/allEvaluate',
    })
  },
  toSubmit: function() {
    wx.navigateTo({
      url: '../submitOrder/submitOrder',
    })
  }
})