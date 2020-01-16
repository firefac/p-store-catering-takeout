var app = getApp();
Page({
  data: {
    choose: false,
    imgPath: '../../img/pic.png',
    imgPath2: '',
    imgPath3: '',
    imgLen: 0,
    temp: []
  },
  choose: function() {
    this.setData({
      choose: !this.data.choose
    })
  },
  choosePic: function () {
    console.log(this.data.temp)
    var that = this;
    if (this.data.imgPath == '../../img/pic.png'){
     wx.chooseImage({
       count: 3,
       sizeType: ['original', 'compressed'],
       sourceType: ['album', 'camera'],
       success: function (res) {
         var len = res.tempFilePaths.length;
         var temp = [that.data.imgPath2, that.data.imgPath3, that.data.imgPath];
         if (that.data.imgLen == 0) {
           for (var i = 0; i < len; i++) {
             temp[i] = res.tempFilePaths[i];
           }
         } else {
           for (var i = that.data.imgLen, j = 0; j < len&&i<3; i++ , j++) {
             temp[i] = res.tempFilePaths[j];
             console.log(temp)
           }
         }
         var len2 = len + that.data.imgLen;
         if (len2>3){
            len2 = 3;
         }
         that.setData({
           imgLen: len2,
           temp: temp,
           imgPath2: temp[0],
           imgPath3: temp[1],
           imgPath: temp[2],
         });
       }
     })
   }
  },
  toSubmit: function () {
    wx.uploadFile({
      url: '',
      filePath: this.data.imgPath,
      name: 'file',
      formData: {

      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  del: function(e) {
    var i = e.currentTarget.dataset.id;
    if(i==0){
      if (this.data.imgPath != '../../img/pic.png') {
        this.setData({
          imgPath2: this.data.imgPath3,
          imgPath3: this.data.imgPath,
          imgPath: '../../img/pic.png',
          imgLen: this.data.imgLen - 1
        })
      }else {
        this.setData({
          imgPath2: this.data.imgPath3,
          imgPath3: '',
          // imgPath2: '',
          imgLen: this.data.imgLen - 1
        })
      }      
    }else if(i==1) {
      if (this.data.imgPath != '../../img/pic.png') {
        this.setData({
          imgPath3: this.data.imgPath,
          imgPath: '../../img/pic.png',
          imgLen: this.data.imgLen - 1
        })
      } else {
        this.setData({
          imgPath3: '',
          imgLen: this.data.imgLen - 1
        })
      }   
    }else if(i==2) {
      this.setData({
        imgPath: '../../img/pic.png',
        imgLen: this.data.imgLen - 1
      })
    }
  }
})