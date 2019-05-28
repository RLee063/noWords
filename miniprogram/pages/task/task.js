// miniprogram/pages/task/task.js
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentBookInfo:{},
    myBooksList:[],
    planData: [[20, 40], [30, 50], [50, 70], [60, 80], [70, 100]],
    plan: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  refresh: function(){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "getLibrary",
      success: res => {
        that.setData({
          myBooksList: []
        })
        wx.hideLoading()
        for(var i of res.result.Library){
          if(i.isChoosen){
            that.setData({
              currentBookInfo: i
            })
          }else{
            if(i.isAdded){
              var myBooksList = that.data.myBooksList
              myBooksList.push(i)
              that.setData({
                myBooksList: myBooksList
              })
            }
          }
        }
        wx.cloud.callFunction({
          name: "getBookInfo",
          data:{
            bid: that.data.currentBookInfo.Bid
          },
          success: res=>{
            var cbinfo = that.data.currentBookInfo
            cbinfo.studiedNum = res.result.bookinfo.studiedWords.length + res.result.bookinfo.easyWords.length
            that.setData({
              currentBookInfo: cbinfo
            })
          },
          fail: err=>{
            wx.hideLoading()
            wx.showToast({
              title: '刷新失败',
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
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '刷新失败',
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack({
          })
        }, 2000)
      }
    })

    wx.cloud.callFunction({
      name: "getPlanOfTask",
      success: res => {
        that.setData({
          plan: that.data.planData[res.result.plan][0]
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '刷新失败',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
          })
        }, 2000)
      }
    })

    // var cBookInfo = {
    //   name: "六级考纲词汇",
    //   plan: {
    //     new: 200,
    //     old: 400
    //   },
    //   totalNum: 2340,
    //   studiedNum: 242,
    //   imgUrl: "../../images/books/book1.png"
    // }
    // that.setData({
    //   currentBookInfo: cBookInfo
    // })

    // var bookList = []
    // bookList.push(cBookInfo)
    // bookList.push(cBookInfo)
    // that.setData({
    //   myBooksList: bookList
    // })
  },
  switchChosen: function(e){
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "removeChoose",
      success: res=>{
        wx.cloud.callFunction({
          name: "chooseBook",
          data: {
            bid: e.currentTarget.dataset.bid
          },
          success: res => {
            wx.hideLoading()
            that.refresh()
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              title: '切换失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: err=>{
        wx.hideLoading()
        wx.showToast({
          title: '切换失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  removeBook: function(e){
    console.log(e)
    wx.showLoading({
      title: '',
    })
    wx.cloud.callFunction({
      name: "removeBook",
      data: {
        bid: e.currentTarget.dataset.bid
      },
      success: res => {
        wx.hideLoading()
        that.refresh()
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: '取消收藏失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.refresh()
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

  toPlanPage: function(e) {
    wx.navigateTo({
      url: '../plan/plan?bid=' + e.currentTarget.dataset.bid,
    })
  },

  toDictionary: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../dictionary/dictionary?type=0&bid=' + e.currentTarget.dataset.bid,
    })
  },

  toLibrary: function(e){
    wx.navigateTo({
      url: '../library/library',
    })
  }
})