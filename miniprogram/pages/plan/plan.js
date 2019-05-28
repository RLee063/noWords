// miniprogram/pages/plan/plan.js

var that 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerDataRaw: [[20, 40], [30, 50], [50, 70], [60, 80], [70, 100]],
    pickerData:[],
    bookInfo: {},
    predict: {
      year: 1997,
      month: 3,
      day: 23
    },
    plan: 0,
    value: [0]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      value: [0]
    })
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getBookInfo",
      data:{
        Bid: options.bid
      },
      success:res => {
        console.log(res)
        that.setData({
          bookInfo: res.result.bookinfo
        })
        that.initPickerData();
        wx.cloud.callFunction({
          name: "getPlanOfTask",
          success: res => {
            wx.hideLoading()
            that.initPredict(res.result.plan)
            that.setData({
              value: [res.result.plan]
            })
          },
          fail: err =>{
            wx.hideLoading()
            wx.showToast({
              title: '获取计划信息失败',
              icon: 'none',
              duration: 2000
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail: res => {
        wx.hideLoading()
        wx.showToast({
          title: '获取单词书信息失败',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  initPickerData: function(){
    var pickerData = that.data.pickerDataRaw
    for (var i = 0; i < pickerData.length; i++) {
      var num = i;
      var p = that.calculateExpect(that.data.bookInfo.unstudyWords.length + that.data.bookInfo.studingWords.length, pickerData[i][0])
      pickerData[i].push(p.totalDay)
    }
    that.setData({
      pickerData: pickerData
    })
  },
  initPredict: function(plan){
    var num = that.data.bookInfo.unstudyWords.length + that.data.bookInfo.studingWords.length//reject
    var p = that.calculateExpect(num, that.data.pickerData[plan][0])
    that.setData({
      predict: p
    })
  },
  calculateExpect: function(num, plan){
    var predict = {
    }
    var now = new Date()
    var month1Left = (new Date(now.getFullYear(), now.getMonth()+1, 0).getDate()) - now.getDate();
    if(month1Left*plan >= num){
      predict.year = now.getFullYear()
      predict.month = now.getMonth()
      predict.day = now.getDate() + Math.ceil(num/(plan))
      predict.totalDay = Math.ceil(num / (plan))
      return predict
    }
    var year = now.getFullYear()
    var month = now.getMonth()
    var totalDay = month1Left
    var numLeft = num - month1Left * plan;
    var monthSet = month + 1;
    while(1){
      var tempDate = now
      tempDate.setMonth(monthSet, 15)
      if(tempDate.getDate()*plan > numLeft){
        predict.year = tempDate.getFullYear()
        predict.month = tempDate.getMonth()
        predict.day = Math.ceil(numLeft / (plan))
        predict.totalDay = totalDay + Math.ceil(numLeft / (plan))
        return predict
      }
      else{
        numLeft -= tempDate.getDate() * plan;
        monthSet ++;
        totalDay += tempDate.getDate();
      }
    }
  },
  pickerChange: function(e){
    that.setData({
      value: e.detail.value
    })
    that.initPredict(e.detail.value)
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

  },

  submit: function(e){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "setPlanOfTask",
      data: {
        plan: this.data.value[0]
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 1000
        })
        setTimeout( () => wx.navigateBack({
          delta: 1
        })
        ,1000)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '设置失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})