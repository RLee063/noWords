// miniprogram/pages/main/main.js
var utils = require("../../utils/utils");
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordInfo: [],
    queryWordInfo: [],
    isQuery: false,
    ready: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '正在查询单词',
    })
    wx.cloud.callFunction({
      name: 'getWord',
      data: {
        Wid: options.Wid,
        name: options.name
      },
      success: res => {
        wx.hideLoading()
        console.log(res)
        if(!res.result.valid){
          wx.showToast({
            title: '无该单词信息',
            icon: 'none',
            duration: 2000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },2000)
        }
        else{
          console.log(res)
          that.setData({
            wordInfo: res.result.wordInfo,
            ready: true,
            cloud: res.result.wordInfo.vector ? true : false
          })
          this.initMagicSentence();
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取单词信息失败',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)
      }
    })

  },

  onUnload: function () {
  },

  pronounce: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = that.data.wordInfo.audioUrl
    innerAudioContext.onPlay(() => { })
  },

  selectWord: function (e) {
    var wordInfo = this.data.wordInfo;
    // wordInfo.magicSentence[e.currentTarget.dataset.index].selected = !wordInfo.magicSentence[e.currentTarget.dataset.index].selected;
    var word;
    for (var i = 0; i < wordInfo.magicSentence.length; i++) {
      if (i != e.currentTarget.dataset.index) {
        wordInfo.magicSentence[i].selected = false;
      }
      else {
        if (wordInfo.magicSentence[i].selected != true) {
          wordInfo.magicSentence[i].selected = true;
          word = wordInfo.magicSentence[i].word;
        }
        else {
          return
        }
      }
    }
    that.setData({
      isQuery: false,
      wordInfo: wordInfo
    })
    // console.log("query="+word)
    //查询单词等待回调
    wx.showLoading({
      title: '正在查询单词',
    })
    wx.cloud.callFunction({
      name: 'getWord',
      data: {
        name: word
      },
      success: res => {
        wx.hideLoading()
        console.log(res)
        if (!res.result.valid) {
          wx.showToast({
            title: '无该单词信息',
            icon: 'none',
            duration: 2000
          })
          this.exitQuery()
        }
        else {
          that.setData({
            queryWordInfo: res.result.wordInfo,
            isQuery: true
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取单词信息失败',
          icon: 'none',
          duration: 2000
        })
        this.exitQuery()
      }
    })
  },

  exitQuery: function (e) {
    var wordInfo = this.data.wordInfo;
    for (var i = 0; i < wordInfo.magicSentence.length; i++) {
      wordInfo.magicSentence[i].selected = false
    }
    that.setData({
      wordInfo: wordInfo,
      isQuery: false
    })
  },

  initMagicSentence: function () {
    var wordInfo = this.data.wordInfo
    wordInfo.magicSentence = utils.parseSentence(this.data.wordInfo.sentence, this.data.wordInfo.name)
    this.setData({
      wordInfo: wordInfo
    })
  },

  addToTask:function(){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "addWord",
      data: {
        wid: that.data.wordInfo.Wid
      },
      success: res => {
        wx.hideLoading()
        that.data.wordInfo.Active = true
        that.setData({
          wordInfo: that.data.wordInfo
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '添加失败',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
          })
        }, 2000)
      }
    })
  },

  viewQueryWordInfo: function (e) {
    wx.navigateTo({
      url: '../wordInfo/wordInfo?name=' + that.data.queryWordInfo.name,
    })
  },

  viewCloud: function(){
    wx.navigateTo({
      url: '../cloud2/cloud2?name=' + that.data.wordInfo.name,
    })    
  }
})