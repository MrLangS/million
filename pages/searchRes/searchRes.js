var util = require('../../utils/util.js')
var year = util.getPicker('year')
var month = util.getPicker('month')
var day = util.getPicker('day')
var app=getApp()
//缓存 日期选择器 改变前的日期
function buff(that) {
  year = that.data.year
  month = that.data.month
  day = that.data.day
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '',
    recordList: [],
    ddlList: [],
    hiddenmodal: true,
    years: util.getPickerList('years'),
    year: year,
    months: util.getPickerList('months'),
    month: month,
    days: util.getPickerList('days'),
    day: day,
    value: util.getPicker('arr'),
    noResult: false,
    pageNum: 1,
    tag: 0,
    dateTag: 0,
    searchTime: '',
    searchVal: '',
    codeval: true,
  },

  inputname(e) {
    this.setData({
      searchVal: e.detail.value
    })
  },
  clearContent: function () {
    this.setData({
      dateTag: 0,
      searchVal: '',
    })
  },
  //弹出框
  chooseDay: function () {
    buff(this)
    console.log("改变前日期为:" + year + "/" + month + "/" + day)
    this.setData({
      hiddenmodal: !this.data.hiddenmodal
    })
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
      year: year,
      month: month,
      day: day
    });
  },
  confirm: function () {
    var date = util.formatDay(this)
    console.log(date)
    this.setData({
      hiddenmodal: true,
      dateTag:1,
    })
  },
  switchCondition: function () {
    this.getList(true)
  },
  //日期选择器事件
  bindChange: function (e) {
    const val = e.detail.value
    console.log(val)
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },

  onLoad: function (options) {
    // this.getList(true, util.formatDay(this))
  },

  onPullDownRefresh: function () {
    this.reload(true)
  },
  //下拉刷新触发
  reload(reload) {
    this.setData({
      noResult: false,
      pageNum: 1,
    })
    this.init(reload)
  },
  init(reload) {
    this.getList(reload)
  },
  // 获取列表
  getList(reload) {
    var that=this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    var requestUrl=''
    requestUrl = getApp().globalData.server + '/LockerAccessRecords/queryARFromWx.do'
    var searchDay = ''
    if (this.data.dateTag != 0) {
      searchDay = util.formatDay(this)
    }
    var personName = this.data.searchVal

    wx.request({
      url: requestUrl,
      data: {
        searchTime: searchDay||'',
        personName: personName||'',
        pageIndex : this.data.pageNum-1,
        regionId: app.globalData.admin.regionId,
        clientId: app.globalData.admin.clientId
      },
      method: 'post',
      success: (res) => {
        console.log("当前页码:" + that.data.pageNum)
        let data = res.data
        console.log(data)
        let list = data.recordList
        if (!util.isEmptyObject(list)) {
          let pageNum = this.data.pageNum + 1
          this.setData({
            pageNum,
            recordList: reload ? list : this.data.recordList.concat(list),
          })
        } else {
          this.setData({
            noResult: true,
          })
          if (that.data.pageNum != 1) {
            wx.showToast({
              title: '已加载至最底!',
              icon: 'none',
            })
          }else{
            this.setData({
              recordList: []
            })
            wx.showToast({
              title: '无匹配结果!',
              icon: 'none',
              duration: 1500,
            })
          }
        }
      },
      fail: () => {
        wx.showToast({
          title: '网路开小差，请稍后再试',
          icon: 'none',
        })
      },
      complete: () => {
        wx.stopPullDownRefresh()
      },
    })
  },

  onReachBottom: function () {
    if (!this.data.recordList.length || !this.data.noResult) {
      if(this.data.valtag){
        this.getList(false, this.data.searchTime)
      } else {
        this.getList(false, this.data.searchVal)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})