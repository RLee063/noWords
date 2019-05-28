// miniprogram/pages/home/home.js
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchText: "",
    signedNum: 0,
    newWordsNum: 0,
    oldWordsNum: 0,
    unstudyWordsNum: 0,
    bookInfo:{},
    progressType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setBookInfo()
  },

  setTaskInfo: function(){
    var newWordsProgress = wx.getStorageSync('newWordsProgress')
    var oldWordsProgress = wx.getStorageSync('oldWordsProgress')
    var newWordsNum = newWordsProgress.totalNum
    var oldWordsNum = oldWordsProgress.totalNum
    var newWordsUnstudyNum = newWordsProgress.unstudyWords.length + newWordsProgress.studingWords.length  
    var oldWordsUnstudyNum =  oldWordsProgress.studingWords.length + oldWordsProgress.unstudyWords.length
    var unstudyWordsNum = newWordsUnstudyNum + oldWordsUnstudyNum
    var complete=false;
    if(newWordsProgress.complete&&oldWordsProgress.complete){
      complete=true;
    }
    that.setData({
      newWordsNum: newWordsNum,
      oldWordsNum: oldWordsNum,
      unstudyWordsNum: unstudyWordsNum,
      complete: complete
    })
  },

  setSignedNum: function(){
    var signedNum = 12
    that.setData({
      signedNum : signedNum
    })
  },

  setBookInfo: function(){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getLibrary",
      success: res => {
        var bid
        for (var i of res.result.Library) {
          if (i.isChoosen) {
            console.log(i)
            bid = i.Bid
            break
          } 
        }
        wx.cloud.callFunction({
          name: "getBookInfo",
          data: {
            bid: bid
          },
          success: res => {
            wx.hideLoading()
            var cbinfo = res.result.bookinfo
            cbinfo.studiedNum = res.result.bookinfo.studiedWords.length + res.result.bookinfo.easyWords.length
            cbinfo.percentage = parseInt(cbinfo.studiedNum/cbinfo.totalNum*100)
            that.setData({
              bookInfo: cbinfo
            })
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              title: '刷新失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '刷新失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  searchInput: function(e){
    this.setData({
      searchText: e.detail.value
    })
  },

  search: function(){
    wx.navigateTo({
      url: '../wordInfo/wordInfo?name=' + this.data.searchText,
    })
    this.setData({
      searchText: ""
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
    this.setTaskInfo()
    this.setSignedNum()

  },

  setSignedNum: function(){
    wx.cloud.callFunction({
      name: "getSignRecord",
      success: res => {
        that.setData({
          signedNum: res.result.signedRecord.length
        })
      },
      fail: e => {
        wx.showToast({
          title: '获取打卡记录失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
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

  startMain: function() {
    wx.navigateTo({
      url: '../main/main'
    })
  },

  toCalendarPage: function(){
    wx.navigateTo({
      url: '../calendar/calendar',
    })
  },

  toDictionary: function(e){
    wx.navigateTo({
      url: '../dictionary/dictionary?type='+e.currentTarget.dataset.type+'&bid='+that.data.bookInfo.Bid,
    })
  }
})