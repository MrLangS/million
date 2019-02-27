var app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ddlList: [],
    hiddenmodal: true,
    name:'',
    noResult: false,
    array: ["3天以上", "4天以上", "5天以上", "6天以上", "7天以上", "8天以上", "9天以上"],
    index:'0',
    pageNum: 1,
  },
  inputname: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindPickerChange: function(e){
    this.setData({
      index: e.detail.value
    })
  },
  search: function(){
    this.getList(true)
  },

  // 获取逾期记录
  getList(reload) {
    var that = this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    wx.request({
      url: getApp().globalData.server + '/LockerAccessRecords/queryOverdueRecordsFromWx.do',
      data: {
        personName: this.data.name,
        overdueDays: parseInt(this.data.index)+3,
        pageIndex: that.data.pageNum - 1,
        regionId: app.globalData.admin.regionId,
        clientId: app.globalData.admin.clientId
      },
      method: 'post',
      success: (res) => {
        console.log("当前页码:" + that.data.pageNum)
        let data = res.data
        console.log(res)
        let list = data
        if (!utils.isEmptyObject(list)) {
          let pageNum = this.data.pageNum + 1
          this.setData({
            pageNum,
            ddlList: reload ? list : this.data.ddlList.concat(list),
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
          } else {
            this.setData({
              ddlList: []
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

  onLoad: function (options) {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    if (!this.data.ddlList.length || !this.data.noResult) {
      this.getList()
    }
  },

  onShareAppMessage: function () {

  }
})