Page({
  data: {
    year: 2018,
    month: 12,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    monthArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    totalNum: 0,
    signedRecord:[
      {
        year: 2019,
        month: 4,
        day: 24
      },
      {
        year: 2019,
        month: 3,
        day: 20
      },
      {
        year: 2019,
        month: 4,
        day: 16
      }
    ],
    value : []
  },
  onLoad: function () {
    var that = this
    wx.showLoading({
      title: '获取打卡信息',
    })
    wx.cloud.callFunction({
      name: "getSignRecord",
      success: res=>{
        wx.hideLoading()
        that.setData({
          signedRecord: res.result.signedRecord,
          totalNum: res.result.signedRecord.length
        })
        that.monthInit()
        that.statusInit()
        that.setData({
          value: [4]
        })
      },
      fail: e=>{
        wx.hideLoading()
        wx.showToast({
          title: '获取单词信息失败',
          icon: 'none',
          duration: 2000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: -1
          })
        }, 2000)
      }
    })
  },
  monthInit: function(){
    var monthArr = []
    var now = new Date()
    var y = now.getFullYear()
    var m = now.getMonth()
    for(var i=0; i<5; i++){
      var month = {}
      month.dateArr = this.dateInit(y, m)
      month.year = y
      month.month = m
      monthArr.unshift(month)
      y = m - 1 < 0 ? y - 1 : y;
      m = m - 1 < 0 ? 11 : m - 1;
    }
    this.setData({
      monthArr: monthArr
    })
  },
  statusInit: function(){
    var now = new Date()
    var y = now.getFullYear()
    var m = now.getMonth()
    var d = now.getDate()

    var monthArr = this.data.monthArr

    for(let i of this.data.signedRecord){
        for(let j of monthArr){
          if(i.year != j.year) continue;
          if(i.month != j.month) continue;
          else{
            var k = 0
            while(!(j.dateArr[k].dateNum)) k++
            j.dateArr[k-1+i.day].status = 1
          }
        }
    }
    for (let j of monthArr) {
      if (y != j.year) continue;
      if (m != j.month) continue;
      else {
        var k = 0
        while (!(j.dateArr[k].dateNum)) k++
        j.dateArr[k - 1 + d].status = 2
      }
    }
    this.setData({
      monthArr: monthArr
    })
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                       //需要遍历的日历数组数据
    let arrLen = 0;                         //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                          //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          dateNum: num,
          weight: 5
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    return dateArr
  }
})