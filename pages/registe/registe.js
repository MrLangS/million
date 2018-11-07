// pages/register/phone/phone.js
var util = require("../../utils/util.js")
var app=getApp()
var preVal=''
var val=''
var id=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    address: '',
    addrList: [{ name: '区域名称1', id: 1 }, { name: '区域名称2', id: 2 }, { name: '区域名称3', id: 3}],
    phoneNumber: '',
    disabled: false,
    code: '',
    iscode: '',//用于存放验证码接口里获取到的code
    codename: '发送验证码',
    bcgImg: '/images/bcgimg1.jpg',
    hiddenmodal: true,
    addrId: 0,
  },

  radioChange: function (e) {
    var arr=e.detail.value.split(',')
    id=arr[0]
    var index=arr[1]
    val=this.data.addrList[index].name
  },
  cancel: function () {
    this.setData({
      hiddenmodal: true,
      address: preVal
    });
  },
  confirm: function () {
    this.setData({
      hiddenmodal: true,
      address: val,
      addrId: id
    })
  },
  getAreaList(){
    this.setData({
      hiddenmodal: false,
    })
  },
  //获取验证码
  getVerificationCode() {
    util.getCode(this)
  },

  getName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  getPhoneValue: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  commit: function(e) {
    let values = e.detail.value
    let phoneNumber = values.phoneNumber || ''
    let code = values.code || ''
    if (util.checkForm(this, 0)) {
      console.log(values)
      wx.request({
        url: app.globalData.server + '/SysWXUserAction/bindingSysAdmin.do',
        data: {
          wxOpenId: app.globalData.openid,
          username: values.name,
          phonenum: values.phoneNumber,
        },
        method: 'post',
        dataType: 'json',
        success: function (res) {
          console.log(res)
          if(res.data.msg=="ok"){
            app.globalData.sysWXUser = res.data.sysWXUser
            app.globalData.admin = res.data.admin
            wx.redirectTo({
              url: '../result/result',
            })
          }else{
            wx.showToast({
              title: '绑定失败！请输入相关联的手机号',
              icon: 'none',
              duration: 2000,
            })
          }
          
        },
        fail: function (res) { },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.login()
    //设置导航栏背景色
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#0496fd',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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

  }
})