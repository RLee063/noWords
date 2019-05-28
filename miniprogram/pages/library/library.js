// miniprogram/pages/library/library.js
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booksList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.refresh()
  },

  refresh: function() {
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getLibrary",
      success: res => {
        console.log(res)
        wx.hideLoading()
        that.setData({
          booksList: res.result.Library
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '获取信息失败',
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

  star: function(e){
    var booksList = this.data.booksList
    var index = e.currentTarget.dataset.index
    if(booksList[index].isAdded){
      booksList[index].isAdded = false
      that.setData({
        booksList: booksList
      })
      wx.cloud.callFunction({
        name: "removeBook",
        data:{
          bid: booksList[index].Bid
        },
        success: res => {
        },
        fail: err => {
          booksList[index].isAdded = true
          that.setData({
            booksList: booksList
          })
          wx.showToast({
            title: '取消收藏失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
    else{
      booksList[index].isAdded = true
      that.setData({
        booksList: booksList
      })
      wx.cloud.callFunction({
        name: "addBook",
        data: {
          bid: booksList[index].Bid
        },
        success: res => {

        },
        fail: err => {
          wx.showToast({
            title: '添加收藏失败',
            icon: 'none',
            duration: 2000
          })
          booksList[index].isAdded = false
          that.setData({
            booksList: booksList
          })
        }
      })
    }
  },
  showCant:function(){
    wx.showToast({
      title: '正在学习不可取消收藏',
      icon: 'none',
      duration: 2000
    })
  },
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

  toDictionary: function (e) {
    wx.navigateTo({
      url: '../dictionary/dictionary?type=0&bid=' + e.currentTarget.dataset.bid,
    })
  },
})