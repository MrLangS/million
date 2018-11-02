var util = require('../../utils/util.js')
var year = util.getPicker('year')
var month = util.getPicker('month')
var day = util.getPicker('day')
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
    this.setData({
      hiddenmodal: true
    })
    var date = util.formatDay(this)
    console.log(date)
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
    this.setData({
      tag: options.tag
    })
    this.init()
    //tag=1代表查询存取记录；tag=0代表查询逾期记录
    if (options.tag == 1) {
      this.setData({
        placeholder: '查询存取记录',
        recordList: [
          { img: '', username: '人员名称1', chest: '北京市公安局1号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
          { img: '', username: '人员名称2', chest: '北京市公安局2号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
          { img: '', username: '人员名称1', chest: '北京市公安局3号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 1 }]
      })
    }
    if (options.tag == 0) {
      this.setData({
        placeholder: '查询逾期记录',
        ddlList: [
          { img: '', username: '人员名称1', chest: '北京市公安局1号柜', phoneNumber: '18401610488', time: '2018-09-12 08:00', status: 0 },
          { img: '', username: '人员名称2', chest: '北京市公安局1号柜', phoneNumber: '18401610499', time: '2018-09-12 08:00', status: 0 },
          { img: '', username: '人员名称1', chest: '北京市公安局1号柜', phoneNumber: '18401610477', time: '2018-09-12 08:00', status: 1 }]
      })
    }
  },

  onPullDownRefresh: function () {
    this.reload()
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
  // 获取小册列表
  getList(reload) {
    var that=this
    if (reload) {
      this.setData({
        pageNum: 1,
      })
    }
    var requestUrl=''
    if(this.data.tag==1){
      //存取记录标
      requestUrl=''
    }else{
      //逾期记录标
      requestUrl = ''
    }
    wx.request({
      url: requestUrl,
      data: {
        pageNum: this.data.pageNum,
      },
      success: (res) => {
        let data = res.data
        if (data.s === 1) {
          let list = data.d
          if (!util.isEmptyObject(list)) {
            let pageNum = that.data.pageNum + 1
            if(that.data.tag==1){
              that.setData({
                pageNum,
                recordList: reload ? list : that.data.recordList.concat(list),
              })
            }else{
              that.setData({
                pageNum,
                ddlList: reload ? list : that.data.ddlList.concat(list),
              })
            }
            
          }
        } else {
          if (data.s === 2) {
            // no result
            that.setData({
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
    if (!this.data.recordList.length || !this.data.noResult || !this.data.ddlList.length) {
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})