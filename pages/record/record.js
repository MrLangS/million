const utils = require('../../utils/util.js')
var timeoutID
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    noResult: false,
    pageNum: 1,
    hideSearch: true,
  },

  search: function () {
    wx.navigateTo({
      url: '/pages/searchRes/searchRes?tag=' + 1,
    })
  },
  //页面滚动监听
  onPageScroll: function (e) {
    if (typeof (timeoutID) != "undefined") {
      clearTimeout(timeoutID)
    }
    var that = this
    // console.log(e);
    that.setData({
      hideSearch: false
    })
    timeoutID = setTimeout(function () {
      that.setData({
        hideSearch: true
      })
    }, 2000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  onPullDownRefresh: function () {
    this.reload(true)
  },
  //下拉刷新触发
  reload(reload){
    this.setData({
      noResult: false,
      pageNum: 1,
    })
    this.init(reload)
  },
  init(reload) {
    this.getList(reload)
  },
  // 获取小册列表
  getList(reload) {
    var that=this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    wx.request({
      url: getApp().globalData.server +'/LockerAccessRecords/queryARFromWx.do',
      data: {
        pageIndex: that.data.pageNum-1,
        // pageIndex: 0,
        regionId: app.globalData.admin.regionId, 
        clientId: app.globalData.admin.clientId
      },
      method: 'post',
      success: (res) => {
        console.log("当前页码:"+that.data.pageNum)
        let data = res.data
        console.log(data)
        let list = data.recordList
        if (!utils.isEmptyObject(list)) {
          let pageNum = this.data.pageNum + 1
          this.setData({
            pageNum,
            recordList: reload ? list : this.data.recordList.concat(list),
          })
        }else{
          this.setData({
            noResult: true,
          })
          if(that.data.pageNum!=1){
            wx.showToast({
              title: '已加载至最底!',
              icon: 'none',
            })
          }else{
            this.setData({
              recordList: [],
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
        
      },
    })
  },

  onReachBottom: function () {
    if (!this.data.recordList.length || !this.data.noResult) {
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})