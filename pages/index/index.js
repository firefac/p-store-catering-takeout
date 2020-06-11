//index.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    // index
    announcements: [],
    categoryProductList: [],
    specificationList: [],
    goods: {},
    productList: [],
    scrollHeight: 0,
    orderType: 0,  //点菜类型
    restaurant: false,  //餐厅点菜
    map_address: '',
    buycar_num: 0,
    foodtype: 0,  //选规格种类
    storeInfo: {},

    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },

    number: 1,
    checkedSpecText: '规格数量选择',
    tmpSpecText: '请选择规格数量',
    checkedSpecPrice: 0,

    openAttr: false //选规格

  },
  onLoad: function () {
    var that = this

    this.getGoodsCategoryProductList()
    this.getStoreInfo()
    this.getaAnnounceList()

  },
  // 页面分享
  onShareAppMessage: function() {
    let that = this;
    return {
      title: storeInfo.name,
      desc: '唯爱与美食不可辜负',
      path: 'pages/index/index'
    }
  },
  getaAnnounceList: function() {
    let that = this;
    util.request(api.AnnounceList, {}, "POST").then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          announcements: res.data
        })
      }
    })
  },
  getStoreInfo: function() {
    let that = this;
    util.request(api.StoreInfo).then(function(res) {
      if (res.errcode === '0') {
        wx.setStorageSync('storeInfo', res.data)
        that.setData({
          storeInfo: res.data
        })
      }
    })
  },
  getGoodsCategoryProductList: function() {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.GoodsCategoryProductList, {
      categoryCode: "takeout"
    }, 'POST').then(function(res) {
      var cateList = res.data.list

      cateList.forEach(function (category, i) {
        if(category.goodsInfos != null){
          category.goodsInfos.forEach(function (goodInfo, i) {
            goodInfo.num = 0
          });
        }
      });

      that.setData({
        categoryProductList: res.data.list
      });
      that.setData({
        classifySeleted: 'classify' + that.data.categoryProductList[0].id
      });

      that.getCartList()

      wx.hideLoading();
    }).catch((err) => {
      wx.hideLoading();
      util.showErrorToast('数据加载失败');
    });
  },
  getCartList: function() {
    let that = this;
    util.request(api.CartList).then(function(res) {
      if (res.errcode === '0') {
        var cartGoods = res.data.cartList

        var cateList = that.data.categoryProductList

        cateList.forEach(function (category, i) {
          if(category.goodsInfos != null){
            category.goodsInfos.forEach(function (goodInfo, i) {
              var num = 0
              cartGoods.forEach(function (cartGoods, i) {
                if(cartGoods.goodsId == goodInfo.id){
                  num = num + cartGoods.number
                }
              })
              goodInfo.num = num
            });
          }
        });
  
        that.setData({
          categoryProductList: cateList,
          cartTotal: res.data.cartTotal
        });

        that.refreshCartNumber()
      }
    }).catch(() => {
      wx.setStorageSync('refreshIndexCart', 1)
    });
  },
  calculateScrollViewHeight: function ()  {
    let that = this
    let query = wx.createSelectorQuery().in(this)
    //根据节点id查询节点部分的高度（px单位）
    query.select('.page1 .head').boundingClientRect();

    query.exec((res) => {
      // 分别取出节点的高度
      let headHeight = 0
      if(res[0] != null){
        headHeight = res[0].height
      }
      // 然后窗口高度（wx.getSystemInfoSync().windowHeight）减去其他不滑动界面的高度
      let scrollViewHeight = wx.getSystemInfoSync().windowHeight -
      headHeight - 44;
      //console.log(scrollViewHeight)
      // 算出来之后存到data对象里面
      that.setData({
        scrollHeight: scrollViewHeight
      });
    })
  },
	onShow: function () {
    //this.getCartList()
    var refreshIndexCart = wx.getStorageSync('refreshIndexCart');
    if (refreshIndexCart === 1) {
      this.getCartList()
      wx.setStorageSync('refreshIndexCart', 0)
    }
	},
	onReady: function () {
    this.calculateScrollViewHeight()
	},
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getGoodsCategoryProductList()
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  reduceSpeci: function (e) {
    var goods = e.currentTarget.dataset.goods;

    if(goods.num == 0){
      wx.showToast({
        title: '不能再减了',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    wx.showToast({
      title: '多规格商品只能去购物车删除哦',
      icon: 'none',
      duration: 2000
    })
  },
  reduceDirect: function (e) {
    var goods = e.currentTarget.dataset.goods;

    if(goods.num == 0){
      wx.showToast({
        title: '不能再减了',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    goods.specificationList[0].valueList[0].checked = true
    //打开规格选择窗口
    this.setData({
      goods: goods,
      productList: goods.productList,
      specificationList: goods.specificationList,
    });
    this.reduce()
  },
  reduce: function(){
    var that = this;
    var productId = this.data.goods.productList[0].id
    util.request(api.CartReduce, {
      goodsId: this.data.goods.id,
      number: this.data.goods.num - 1,
      productId: productId
    }, "POST")
    .then(function(res) {
      let _res = res;
      if (_res.errcode == '0') {
        that.refreshProductNumber(that.data.goods.id, productId, -that.data.number)
        that.setData({
          openAttr: false,
          cartGoodsCount: _res.data
        });
      } else {
        wx.showToast({
          image: '/img/icon_error.png',
          title: _res.errmsg,
          mask: true
        });
      }
    });
    this.setData({
      openAttr: false
    });
  },
  add: function (e) {
    var goods = e.currentTarget.dataset.goods;
    //打开规格选择窗口
    this.setData({
      number: 1,
      goods: goods,
      productList: goods.productList,
      specificationList: goods.specificationList,
      openAttr: true
    });
    
  },
  addDirect: function (e) {
    var goods = e.currentTarget.dataset.goods;
    goods.specificationList[0].valueList[0].checked = true
    //打开规格选择窗口
    this.setData({
      number: 1,
      goods: goods,
      productList: goods.productList,
      specificationList: goods.specificationList,
    });
    this.submit()
  },
  close: function () {
    this.setData({
      openAttr: false
    });
  },
  resetNum: function (e) {
    var type = e.currentTarget.dataset.id;
    this.setData({
      foodtype: type
    })
  },
  submit: function() {
    var that = this;
    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      wx.showToast({
        image: '/img/icon_error.png',
        title: '请选择完整规格'
      });
      return false;
    }

    //根据选中的规格，判断是否有对应的sku信息
    let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
    if (!checkedProductArray || checkedProductArray.length <= 0) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        image: '/img/icon_error.png',
        title: '没有库存'
      });
      return false;
    }

    let checkedProduct = checkedProductArray[0];
    //验证库存
    if (checkedProduct.number <= 0) {
      wx.showToast({
        image: '/img/icon_error.png',
        title: '没有库存'
      });
      return false;
    }

    //添加到购物车
    util.request(api.CartAdd, {
      goodsId: this.data.goods.id,
      number: this.data.number,
      productId: checkedProduct.id
    }, "POST")
    .then(function(res) {
      let _res = res;
      if (_res.errcode == '0') {
        that.refreshProductNumber(that.data.goods.id, checkedProduct.id, that.data.number)
        that.setData({
          openAttr: false,
          cartGoodsCount: _res.data
        });
      } else {
        wx.showToast({
          image: '/img/icon_error.png',
          title: _res.errmsg,
          mask: true
        });
      }
    });
    this.setData({
      openAttr: false
    });
  },

  refreshProductNumber: function(goodsId, productId, number){
    var cateList = this.data.categoryProductList

    cateList.forEach(function (category, i) {
      if(category.goodsInfos != null){
        category.goodsInfos.forEach(function (goodInfo, i) {
          if(goodsId == goodInfo.id){
            goodInfo.num = goodInfo.num  + number
          }
        })
      }
    });

    this.setData({
      categoryProductList: cateList,
      'cartTotal.checkedGoodsCount': this.data.cartTotal.checkedGoodsCount + number
    });
    
    this.refreshCartNumber()
  },
  refreshCartNumber: function(){
    var checkedGoodsCount = this.data.cartTotal.checkedGoodsCount
    if(checkedGoodsCount == null || checkedGoodsCount == 0){
      wx.hideTabBarRedDot({
        index: 1
      })
    }else{
      wx.setTabBarBadge({
        index: 1,
        text: checkedGoodsCount.toString()
      })
    }
  },


  //获取选中的规格信息
  getCheckedSpecValue: function() {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        name: _specificationList[i].name,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;
  },

  //判断规格是否选择完整
  isCheckedAllSpec: function() {
    return !this.getCheckedSpecValue().some(function(v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },

  getCheckedSpecKey: function() {
    let checkedValue = this.getCheckedSpecValue().map(function(v) {
      return v.valueText;
    });
    return checkedValue;
  },

  // 规格改变时，重新计算价格及显示信息
  changeSpecInfo: function() {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function(v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function(v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        tmpSpecText: checkedValue.join('　')
      });
    } else {
      this.setData({
        tmpSpecText: '请选择规格数量'
      });
    }

    if (this.isCheckedAllSpec()) {
      this.setData({
        checkedSpecText: this.data.tmpSpecText
      });

      // 规格所对应的货品选择以后
      let checkedProductArray = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProductArray || checkedProductArray.length <= 0) {
        this.setData({
          soldout: true
        });
        console.error('规格所对应货品不存在');
        return;
      }

      let checkedProduct = checkedProductArray[0];
      if (checkedProduct.number > 0) {
        this.setData({
          checkedSpecPrice: checkedProduct.price,
          soldout: false
        });
      } else {
        this.setData({
          checkedSpecPrice: this.data.goods.retailPrice,
          soldout: true
        });
      }

    } else {
      this.setData({
        checkedSpecText: '规格数量选择',
        checkedSpecPrice: this.data.goods.retailPrice,
        soldout: false
      });
    }

  },
  onChangeNumber: function(event) {
    this.setData({
      number: parseInt(event.detail)
    })
  },

  // 规格选择
  clickSkuValue: function(event) {
    let that = this;
    let specName = event.currentTarget.dataset.name;
    let specValueId = event.currentTarget.dataset.valueId;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].name === specName) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      specificationList: _specificationList,
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },

  // 获取选中的产品（根据规格）
  getCheckedProductItem: function(key) {
    return this.data.productList.filter(function(v) {
      if (v.specifications.toString() == key.toString()) {
        return true;
      } else {
        return false;
      }
    });
  },
  showMap() {
    wx.openLocation({
      latitude: this.data.storeInfo.lat,
      longitude: this.data.storeInfo.lng,
      name: this.data.storeInfo.name,
      address: this.data.storeInfo.address,
    })
  },
  //事件处理函数
	onGoodsScroll: function (e) {
		if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
      });
      this.calculateScrollViewHeight()
		} else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
      });
      this.calculateScrollViewHeight()
		}

		var scale = e.detail.scrollWidth / 570,
			scrollTop = e.detail.scrollTop / scale,
			h = 0,
			classifySeleted,
			len = this.data.categoryProductList.length;
		this.data.categoryProductList.forEach(function (classify, i) {
      var _h = 70
      if(classify.goodsInfos != null){
        _h = 70 + classify.goodsInfos.length * (46 * 3 + 20 * 2);
      }
			
			if (scrollTop >= h - 100 / scale) {
				classifySeleted = 'classify' + classify.id;
			}
			h += _h;
		});
		this.setData({
			classifySeleted: classifySeleted
		});
	},
	tapClassify: function (e) {
		var id = e.target.dataset.id;
		this.setData({
			classifyViewed: id
    });
    
		var self = this;
		setTimeout(function () {
			self.setData({
				classifySeleted: id
			});
		}, 100);
	}
})
