const utils = require('../../utils/util.js')
var timeoutID
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [
      { img: '', username: '人员名称1',chest:'北京市公安局1号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
      { img: '', username: '人员名称2',chest:'北京市公安局2号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
      { img: '', username: '人员名称1',chest:'北京市公安局3号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 1 },
      { img: '', username: '人员名称1',chest:'北京市公安局4号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 1 },
      { img: '', username: '人员名称1',chest:'北京市公安局5号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
      { img: '', username: '人员名称1',chest:'北京市公安局6号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
      { img: '', username: '人员名称1',chest:'北京市公安局7号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
      { img: '', username: '人员名称1',chest:'北京市公安局8号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
      { img: '', username: '人员名称2',chest:'北京市公安局1号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 1 }],
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
    this.reload()
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
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    wx.request({
      url: '',
      data: {
        pageNum: this.data.pageNum,
      },
      success: (res) => {
        let data = res.data
        if (data.s === 1) {
          let list = data.d
          if (!utils.isEmptyObject(list)) {
            let pageNum = this.data.pageNum + 1
            this.setData({
              pageNum,
              recordList: reload ? list : this.data.recordList.concat(list),
            })
          }
        } else {
          if (data.s === 2) {
            // no result
            this.setData({
              noResult: true,
            })
          } else {
            wx.showToast({
              title: data.m.toString(),
              icon: 'none',
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
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})