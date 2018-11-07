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
    searchTime: '',
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
      searchTime: date,
      recordList: [],
    })
    this.getList(true, date)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(true, util.formatDay(this))
    // this.setData({
    //   tag: options.tag
    // })
    // //tag=1代表查询存取记录；tag=0代表查询逾期记录
    // if (options.tag == 1) {
    //   this.setData({
    //     placeholder: '查询存取记录',
    //     recordList: [],
    //   })
    // }
    // if (options.tag == 0) {
    //   this.setData({
    //     placeholder: '查询逾期记录',
    //     ddlList: []
    //   })
    // }
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
    this.init(reload,this.data.searchTime)
  },
  init(reload,date) {
    this.getList(reload,date)
  },
  // 获取列表
  getList(reload,date) {
    var that=this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    var requestUrl=''
    requestUrl = getApp().globalData.server + '/LockerAccessRecords/queryARFromWx.do'
    wx.request({
      url: requestUrl,
      data: {
        searchTime : date,
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
      this.getList(false,this.data.searchTime)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})