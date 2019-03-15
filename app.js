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
    realOpenid: null,
    // server: 'http://192.168.0.251:8080/ebank',
    server: 'https://doortest.faceos.com',
    // server: 'https://doorcontrol.faceos.com/FaceMonitorWeb',
  }
})