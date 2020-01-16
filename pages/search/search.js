// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr3: [
      { id: 0, img: "../../img/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味" }, { id: 1, value: "盐焗味" }, { id: 2, value: "蒜香味" }, { id: 3, value: "姜葱味" },] },
      { id: 1, img: "../../img/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: '' },
      { id: 2, img: "../../img/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味2" }, { id: 1, value: "盐焗味2" }, { id: 2, value: "蒜香味2" }, { id: 3, value: "姜葱味2" },] },
      { id: 3, img: "../../img/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味3" }, { id: 1, value: "盐焗味3" }, { id: 2, value: "蒜香味3" }, { id: 3, value: "姜葱味3" },] },
      { id: 4, img: "../../img/food2.jpg", name: "五花肉石锅拌饭", num: "0", price: "51", message: "配米饭一份哦", message2: "月售330｜好评率100%", message3: [{ id: 0, value: "香辣味4" }, { id: 1, value: "盐焗味4" }, { id: 2, value: "蒜香味4" }, { id: 3, value: "姜葱味4" },] },
    ],
  },
  toFoodDetail: function () {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})