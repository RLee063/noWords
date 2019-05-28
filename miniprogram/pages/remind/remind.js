// miniprogram/pages/remind/remind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerData: [],
    value: [0],
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pickerData = this.data.pickerData;
    for(var i=0; i<24; i++){
      if(i<10){
        pickerData.push("0"+i.toString()+":00");
      }
      else{
        pickerData.push(i.toString()+":00");
      }
    }
    this.setData({
      pickerData: pickerData,
    })
    wx.showLoading({
    })
    var that = this
    wx.cloud.callFunction({
      name: "getReminder",
      success: res => {
        console.log(res)
        wx.hideLoading()
        that.setData({
          value: [res.result.warning],
          checked: res.result.valid
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取打卡设置失败',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  switchChange: function(e){
    console.log(e)
    this.setData({
      checked: e.detail.value
    })
  },

  pickerChange: function(e){
    console.log(e)
    this.setData({
      value: e.detail.value
    })
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
    wx.cloud.callFunction({
      name: "setReminder",
      data: {
        warning: this.data.value[0],
        valid: this.data.checked
      },  
      success: res => {
      },
      fail: err => {
      }
    })
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