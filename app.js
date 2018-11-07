//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    sysWXUser: null,
    admin: null,
    openid: null,
    // server: 'http://192.168.0.253:8080/FaceMonitorWeb',
    server: 'https://doorcontrol.faceos.com/FaceMonitorWeb',
  }
})