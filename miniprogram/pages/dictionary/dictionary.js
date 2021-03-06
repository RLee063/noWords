// miniprogram/pages/dictionary/dictionary.js
var that
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMask: 1,
    type: 0,
    tabIndex: 0,
    page: [0,0,0,0],
    newWordsList: [],
    oldWordsList: [],
    unstudyWordsList: [],
    studiedWordsList: [],
    studingWordsList: [],
    easyWordsList: [],
    currentWordsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    that = this
    that.setData({
      type : parseInt(options.type)
    })
    var currentWordsList
    console.log(that.data.type)
    if(that.data.type){
      var task = wx.getStorageSync('task');
      that.setData({
        newWordsList: task.newWords,
        oldWordsList: task.oldWords
      })
      this.setCurrentList(4)
    }
    else{
      wx.showLoading({
        title: '',
      })
      wx.cloud.callFunction({
        name: "getBookInfo",
        data:{
          bid: parseInt(options.bid)
        },
        success: res => {
          console.log(res)
          wx.hideLoading()
          that.setData({
            unstudyWords: res.result.bookinfo.unstudyWords,
            studiedWords: res.result.bookinfo.studiedWords,
            studingWords: res.result.bookinfo.studingWords,
            easyWords: res.result.bookinfo.easyWords
          })
          that.initList()
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            title: '获取词表失败',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateBack({
            })
          }, 2000)
        }
      })
    }
  },
  initList: function(e){
    that.getMore0()
    that.getMore1()
    that.getMore2()
    that.getMore3()
  },
  getMore0: function(){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getWordsInfo",
      data: {
        widList: that.data.unstudyWords.slice(that.data.page[0] * 20, that.data.page[0] *20 + 20),
        page: that.data.page[0]
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        that.data.page[0]++;
        var wl = that.data.unstudyWordsList.concat(res.result.wordList)
        console.log(wl)
        that.setData({
          unstudyWordsList: wl
        })
        that.setCurrentList(0)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取词表失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getMore1: function () {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getWordsInfo",
      data: {
        widList: that.data.studingWords.slice(that.data.page[1] * 20, that.data.page[1] * 20 + 20),
        page: that.data.page[1]
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        that.data.page[1]++;
        var wl = that.data.studingWordsList.concat(res.result.wordList)
        console.log(wl)
        that.setData({
          studingWordsList: wl
        })
        that.setCurrentList(1)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取词表失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getMore2: function () {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getWordsInfo",
      data: {
        widList: that.data.studiedWords.slice(that.data.page[2] * 20, that.data.page[2] * 20 + 20),
        page: that.data.page[2]
      },
      success: res => {
        console.log(res)
        wx.hideLoading()
        that.data.page[2]++;
        var wl = that.data.studiedWordsList.concat(res.result.wordList)
        console.log(wl)
        that.setData({
          studiedWordsList: wl
        })
        that.setCurrentList(2)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取词表失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getMore3: function () {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getWordsInfo",
      data: {
        widList: that.data.easyWords.slice(that.data.page[3] * 20, that.data.page[3] * 20 + 20),
        page: that.data.page[3]
      },
      success: res => {
        wx.hideLoading()
        that.data.page[3]++;
        var wl = that.data.easyWordsList.concat(res.result.wordList)
        console.log(wl)
        that.setData({
          easyWordsList: wl
        })
        that.setCurrentList(3)
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取词表失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }, 
  changeList: function(e){
    var index = parseInt(e.currentTarget.dataset.index)
    if(!that.data.type){
      switch (index) {
        case 0:
          this.setCurrentList(0)
          break;
        case 1:
          this.setCurrentList(1)
          break;
        case 2:
          this.setCurrentList(2)
          break;
        case 3:
          that.setCurrentList(3)
          break;
        default:
          break;
      }
    }
    else{
      if(!index){
        that.setCurrentList(4)
      }
      else{
        that.setCurrentList(5)
      }
    }
  },

  setCurrentList: function(i){
    var currentWordsList = []
    switch (i) {
      case 0:
        currentWordsList = that.data.unstudyWordsList
        break;
      case 1:
        currentWordsList = that.data.studingWordsList
        break;
      case 2:
        currentWordsList = that.data.studiedWordsList
        break;
      case 3:
        currentWordsList = that.data.easyWordsList
        break;
      case 4:
        currentWordsList = that.data.newWordsList
        break;
      case 5:
        currentWordsList = that.data.oldWordsList
        break;
      default:
        break;
    }
    if(this.data.isMask){
      for (let i of currentWordsList) {
        i.mask = true
      }
    }

    that.setData({
      currentWordsList: currentWordsList,
      tabIndex: i
    })
  },
  wordMask: function(e){
    var currentWordsList = that.data.currentWordsList
    currentWordsList[e.currentTarget.dataset.index].mask = !currentWordsList[e.currentTarget.dataset.index].mask
    that.setData({
      currentWordsList: currentWordsList
    })
  },

  maskSwitchChange: function(e){
    var currentWordsList = that.data.currentWordsList
    var mask = e.detail.value
    for( let i of currentWordsList){
      i.mask = mask
    }
    that.setData({
      isMask: mask,
      currentWordsList: currentWordsList
    })
  },

  viewWordInfo: function(e){
    wx.navigateTo({
      url: '../wordInfo/wordInfo?Wid=' + that.data.currentWordsList[e.currentTarget.dataset.index].Wid
    })
  },

  pronounce: function(e){
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.data.currentWordsList[e.currentTarget.dataset.index].audioUrl
    innerAudioContext.onPlay(() => { })
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
    if(that.data.type==1) return;
    switch (that.data.tabIndex){
      case 0:
        that.getMore0();
        break;
      case 1:
        that.getMore1();
        break;
      case 2:
        that.getMore2();
        break;
      case 3:
        that.getMore3();
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})