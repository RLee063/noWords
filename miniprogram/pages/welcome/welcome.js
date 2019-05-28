// miniprogram/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.login()
    this.globalData = {}
  },
  initTask: function () {
    var lastLoginDate;
    if(lastLoginDate = wx.getStorageSync('lastLoginDate')){
      if(this.isToday(lastLoginDate)){
        setTimeout(() => {
          wx.switchTab({
            url: '../home/home',
          })
        }, 3000) 
        return;
      }
    }
    this.setNewDate();
    this.setNewTask();
  },
  isToday: function (dateCmp) {
    var today = new Date();
    if (today.getFullYear() == dateCmp.year) {
      if (today.getMonth() == dateCmp.month) {
        if (today.getDay() == dateCmp.day) {
          return true;
        }
      }
    }
    return false;
  },

  setNewDate: function () {
    var today = new Date();
    var date = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDay()
    }
    wx.setStorageSync('lastLoginDate', date);
  },
  setNewTask: function () {
    wx.cloud.callFunction({
      name: 'getTask',
      data: {
      },
      success: res => {
        console.log(res)
        wx.setStorageSync('task', res.result.task)
        this.resetProgress(res.result.task);
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '获取任务失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  resetProgress: function (task) {
    console.log(task)
    var progress1 = {
      globalTimeCount: 0,
      localTimeCount: 0,
      complete: false,
      totalNum: 0,
      unstudyWords: [],
      studingWords: [],
      studiedWords: [],
      easyWords: [],
      startTime: (new Date()).getTime()
    }
    var progress2 = {
      type: 0,
      globalTimeCount: 0,
      localTimeCount: 0,
      complete: false,
      totalNum: 0,
      unstudyWords: [],
      studingWords: [],
      studiedWords: [],
      easyWords: [],
      startTime: (new Date()).getTime()
    }
    progress1.totalNum = task.newWords.length;
    progress1.unstudyWords = task.newWords;
    progress1.type = 0
    wx.setStorageSync('newWordsProgress', progress1);
    progress2.totalNum = task.oldWords.length;
    progress2.unstudyWords = task.oldWords;
    progress2.type = 1
    wx.setStorageSync('oldWordsProgress', progress2);
    wx.setStorageSync('studyTime', 0)
    setTimeout(() => {
      wx.switchTab({
        url: '../home/home',
      })
    }, 1000) 
  },
  login:function(options) {
    wx.cloud.callFunction({
      name: 'login',
      success: res=>{
        this.initTask()
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '登陆失败',
          icon: 'none',
          duration: 2000
        })
      }
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