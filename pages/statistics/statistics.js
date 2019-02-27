var app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ["3天", "4天", "5天", "6天", "7天", "8天", "9天"],
    index: '0',
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    this.getOverdue()
  },

  getCount: function(){
    wx.request({
      url: app.globalData.server +'/LockerAccessRecords/queryARCountFromWx.do',
      data: {
        regionId: app.globalData.admin.regionId,
        clientId: app.globalData.admin.clientId
      },
      method: 'post',
      success: (res)=>{
        var data=res.data
        this.setData({
          fetchCountForMonth: data.fetchCountForMonth,
          fetchCountForWeek: data.fetchCountForWeek,
          saveCountForMonth: data.saveCountForMonth,
          saveCountForWeek: data.saveCountForWeek,
        })
      }
    })

  },
  //获得逾期数目
  getOverdue: function(){
    
    wx.request({
      url: app.globalData.server + '/LockerAccessRecords/queryOverdueCountFromWx.do',
      data: {
        overdueDays: parseInt(this.data.index)+3,
        regionId: app.globalData.admin.regionId,
        clientId: app.globalData.admin.clientId
      },
      method: 'post',
      success: (res) => {
        var data = res.data
        this.setData({
          overNum: res.data.overNum
        })
      }
    })
  },
  reload(){
    this.getCount()
    this.getOverdue()
  },
  onLoad: function (options) {
    this.reload()
  },

  onPullDownRefresh: function () {
    this.reload()
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },1000)
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})