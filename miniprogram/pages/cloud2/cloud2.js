var angleX = Math.PI / 200
var angleY = Math.PI / 200
var angleZ = Math.PI / 200
const app = getApp()
const size = 450
var that 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryWordInfo: {},
    word: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    console.log(options.name)
    wx.cloud.callFunction({
      name: 'getVectors',
      data: {
        Wid: options.Wid,
        name: options.name
      },
      success: res => {
        console.log(res)
        that.setData({
          wordList: res.result.wordList,
          word: options.name
        })
        this.innit()
      },
      fail: err => {
        wx.showToast({
          name: '获取词向量失败',
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

  innit() {
    var words = that.data.wordList

    for (var i = 0; i < words.length; i++) {
      words[i].x = size * words[i].x - (size / 2)
      words[i].y = size * words[i].y - (size / 2)
      words[i].z = size * words[i].z - (size / 2)
      words[i].s = (words[i].z + size) / size +0.3
      words[i].o = (words[i].z + size) / size + 0.5
      if(words[i].name == this.data.word){
        words[i].center = true
      }
    }
    setInterval(() => {
      var cosx = Math.cos(angleX)
      var sinx = Math.sin(angleX)
      var cosy = Math.cos(angleY)
      var siny = Math.sin(angleY)
      var cosz = Math.cos(angleZ)
      var sinz = Math.sin(angleZ)

      for (var i = 0; i < words.length; i++) {
        var y1 = words[i].y * cosx - words[i].z * sinx
        var z1 = words[i].z * cosx + words[i].y * sinx
        words[i].y = y1
        words[i].z = z1

        var x2 = words[i].x * cosy - words[i].z * siny
        var z2 = words[i].z * cosy + words[i].x * siny
        words[i].x = x2
        words[i].z = z2

        var x3 = words[i].x * cosz - words[i].y * sinz
        var y3 = words[i].y * cosz + words[i].x * sinz
        words[i].x = x3
        words[i].y = y3
        words[i].s = (words[i].z*0.5 + size) / size + 0.3
        words[i].o = (words[i].z + size) / size + 0.3
        this.setData({
          wordList: words
        })
        console.log(that.data.wordList)
      }
    }, 100)
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
  exitQuery: function (e) {
    console.log(this.data)
    var wordList = this.data.wordList;
    for (var i = 0; i < wordList.length; i++) {
      wordList[i].selected = false
    }
    this.setData({
      wordList: wordList,
      isQuery: false
    })
  },

  selectWord: function (e) {
    console.log(this.data)
    var wordList = this.data.wordList;
    // wordInfo.magicSentence[e.currentTarget.dataset.index].selected = !wordInfo.magicSentence[e.currentTarget.dataset.index].selected;
    var word;
    for (var i = 0; i < wordList.length; i++) {
      if (i != e.currentTarget.dataset.index) {
        wordList[i].selected = false;
      }
      else {
        if (wordList[i].selected != true) {
          wordList[i].selected = true;
          word = wordList[i].name;
        }
        else {
          return
        }
      }
    }
    // console.log("query="+word)

    var wordInfo = {}
    wordInfo.name = word;
    wordInfo.sentence = 'not a big X';
    wordInfo.meaning = "n. 字幕";
    wordInfo.soundmark = "/a'res/";
    wordInfo.sentenceMeaning = "且随疾风前行";
    //查询单词等待回调
    console.log(wordList)
    this.setData({
      queryWordInfo: wordInfo,
      wordList: wordList,
      isQuery: true
    })
  },
})