// pages/authorize/authorize.js
var app = getApp();
Page({

  data: {
    remind: '加载中',
    angle: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      wx.redirectTo({
        url: '/pages/registe/registe',
      })
    } else {
      //用户按了拒绝按钮
    }
  },

  onLoad: function (options) {

  },

  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },

  onShow: function () {

  },

  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
})