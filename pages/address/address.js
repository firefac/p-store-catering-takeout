Page({
  data: {
    num: 0,
    noAddress: false,
    arr: [
      { id: 0, name: "张三 先生", phone: "123456789", address:"启梦创业广场1A158-159"},
      { id: 1, name: "张三 先生", phone: "123456789", address: "启梦创业广场1A158-159" },
      { id: 2, name: "张三 先生", phone: "123456789", address: "启梦创业广场1A158-159" },
    ],
  },
  chooseAddress: function(e) {
    var type = e.currentTarget.dataset.id;
    this.setData({
      num: type
    })
  },
  addAddress: function() {
    wx.navigateTo({
      url: '../addAddress/addAddress'
    })
  },
  delAddress: function() {
     var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          var index = that.data.num;
          var arr = that.data.arr;
          arr.splice(index, 1);
          that.setData({
            arr: arr
          })
        }
      }
    })
    
  },
  toEdit: function(e) {
    var type = e.target.dataset.id;
    wx.navigateTo({
      url: '../addAddress/addAddress?id='+type,
    })
  }
})