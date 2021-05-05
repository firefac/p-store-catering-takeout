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
    qrShow: false,
    shipShow: false,
    expressIndex: 0,
    expressSn: '',
    expresses: ["顺丰速运", "百世快递","中通快递","申通快递","圆通速递", "韵达速递", "邮政快递包裹", "EMS", "天天快递", "京东快递", "优速快递", "德邦快递", "宅急送"],
    expressCodes: ["shunfeng", "huitongkuaidi","zhongtong",
      "shentong","yuantong", "yunda", "youzhengguonei", 
      "ems", "tiantian", "jd", "youshuwuliu", "debangwuliu", "zhaijisong"],
    expressMap: {
      'shunfeng': '顺丰速运',
      'huitongkuaidi': '百世快递',
      'zhongtong': '中通快递',
      'shentong': '申通快递',
      'yuantong': '圆通速递',
      'yunda': '韵达速递',
      'youzhengguonei': '邮政快递包裹',
      'ems': 'EMS',
      'tiantian': '天天快递',
      'jd': '京东快递',
      'youshuwuliu': '优速快递',
      'debangwuliu': '德邦快递',
      'zhaijisong': '宅急送'
    }
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
        url: api.OrderAdminGeneralQr + '?orderId=' + this.data.orderId, //仅为示例，并非真实的资源
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
  showShipDialog(){
    this.setData({ shipShow: true });
  },
  onShipClose() {
    this.setData({ shipShow: false });
  },

  bindExpressChange: function(e) {
    this.setData({
      expressIndex: e.detail.value
    })
  },
  onExpressSnChange: function(e){
    this.setData({
      expressSn: e.detail
    });
  },
  // “确认收货”点击效果
  ship: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确认发货？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.OrderAdminShip, {
            orderId: orderInfo.id,
            shipChannel: that.data.expressCodes[that.data.expressIndex],
            shipSn: that.data.expressSn
          }, 'POST').then(function(res) {
            if (res.errcode === '0') {
              wx.showToast({
                title: '确认收货成功！'
              });
              that.getOrderDetail();
              that.setData({ shipShow: false });
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
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
  jumpToKuaidi100: function(){
    wx.navigateToMiniProgram({
      appId: "wx6885acbedba59c14",
      path: 'pages/result/result?nu=' + this.data.orderInfo.expNo + '&com=&querysource=third_xcx',
      success(res) {
        // 打开成功
      }
    })
  },
  /**
   * 地址：河北省石家庄市新华区联盟街道北二环西路大郭东园B区6排3号（蓝天苑北邻）
收件人：翁绍芳&崔亚欣
电话：13833110266
备注：1箱特级果
   * 
  */
  copyOrderInfo: function(){
    var info = ''
    var orderInfo = this.data.orderInfo

    info = info + '地址：' + orderInfo.address + '\n';
    info = info + '收件人：' + orderInfo.consignee + '\n';
    info = info + '电话：' + orderInfo.mobile + '\n';

    var remark = ''
    this.data.orderGoods.forEach((e, i)=>{
      remark = remark + e.goodsName + '(' + e.specificationList + ') * ' + e.number + '\n'
    })
    info = info + '备注：' + remark;

    wx.setClipboardData({
      data: info,
      success (res) {
      }
    })
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})