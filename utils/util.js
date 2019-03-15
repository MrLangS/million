const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
var app = getApp()
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatDay(that) {
  var date = that.data
  return [date.year, date.month, date.day].map(formatNumber).join('-')
}
const JsonToArray = json => {
  var arr = []
  for (var j in json) {
    arr.push(json[j])
  }
  return arr
}
//获取日期
function getPicker(tag) {
  const date = new Date()
  if (tag == 'year') {
    return date.getFullYear()
  } else if (tag == 'month') {
    return date.getMonth() + 1
  } else if (tag == 'day') {
    return date.getDate()
  } else if (tag == 'arr') {
    return [date.getFullYear() - 2017, date.getMonth(), date.getDate() - 1]
  } else if (tag == 'hour') {
    return date.getHours()
  } else if (tag == 'minute') {
    return date.getMinutes()
  }
}

function checkCode(that) {
  if (that.data.code.trim() == "") {
    wx.showToast({
      title: '验证码不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (that.data.code != that.data.iscode) {
    wx.showToast({
      title: '验证码错误',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkPhone(that) {
  var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
  if (that.data.phoneNumber.trim() == "") {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else if (!myreg.test(that.data.phoneNumber)) {
    wx.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkImage(that) {
  if (that.data.quality == 1) {
    wx.showToast({
      title: '照片须为本人清晰头像',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkUsername(that) {
  if (that.data.username == "") {
    wx.showToast({
      title: '用户名不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkCompname(that) {
  if (that.data.company == "") {
    wx.showToast({
      title: '公司名称不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkAddress(that) {
  if (that.data.address.trim() == "") {
    wx.showToast({
      title: '区域不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
function checkName(that) {
  if (that.data.name.trim() == "") {
    wx.showToast({
      title: '姓名不能为空',
      icon: 'none',
      duration: 1000
    })
    return false;
  } else {
    return true
  }
}
//表单验证
function checkForm(that, tag) {
  if (tag == 0) {
    if (checkName(that) &&checkPhone(that) && checkCode(that)) {
    // if (checkName(that) && checkPhone(that)) {
      return true
    } else {
      return false
    }
  } else {
    if (checkImage(that) && checkUsername(that) && checkCompname(that)) {
      return true
    } else {
      return false
    }
  }

}
//获取验证码
function getCode(that) {
  var endPhone = that.data.phoneNumber.substr(7, 4)
  if (checkPhone(that)) {
    that.setData({
      disabled: true
    })
    wx.request({
      url: getApp().globalData.server + "/SysWXUserAction/sendVerificationCode.do?phoneNo=" + that.data.phoneNumber,
      data: {},
      method: 'post',
      success(res) {
        console.log(res)
        that.setData({
          iscode: res.data.code
        })
        wx.showToast({
          title: '已向尾号' + endPhone + '的手机成功发送验证码',
          icon: 'none',
          duration: 1500
        })
        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            that.setData({
              codename: '发送验证码',
              disabled: false
            })

          } else {
            that.setData({
              codename: "重发 (" + num + "s)"
            })
          }
        }, 1000)
      }
    })
  }
}

//获取日期列表
function getPickerList(tag) {
  const years = []
  const months = []
  const days = []
  const nums = []
  for (let i = 2017; i <= 2048; i++) {
    years.push(i)
  }
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }
  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }
  for (let i = 1; i <= 20; i++) {
    nums.push(i)
  }
  if (tag == 'years') {
    return years
  } else if (tag == 'months') {
    return months
  } else if (tag == 'days') {
    return days
  } else if (tag == 'nums') {
    return nums
  }
}
function login() {
  var encryptedData = null
  var iv = null
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code
      if (code) {
        console.log('获取用户登录凭证：' + code);
        wx.getUserInfo({
          success: function (res) {
            encryptedData = res.encryptedData
            iv = res.iv
            //用户已经授权过
            var loginUrl = getApp().globalData.server + '/SysWXUserAction/onLogin.do';
            // --------- 发送凭证 ------------------
            wx.request({
              url: loginUrl,
              data: { 
                code: code,
                encryptedData: encryptedData,
                iv: iv,
                userType: '4'
              },
              method: 'post',
              success: function (res) {
                var openid = res.data.openid //返回openid
                console.log("openid is: " + openid);
                getApp().globalData.openid = openid
                getApp().globalData.realOpenid = res.data.miniproId
                wx.setStorageSync('openid', openid);
                var registed = res.data.registed
                wx.setStorageSync('registed', registed)
                console.log("registed:" + registed)

                //已注册用户的处理
                if (registed == 1) {
                  wx.request({
                    url: getApp().globalData.server + '/SysWXUserAction/getAdminMsgByOpenId.do?openId=' + openid,
                    data: {
                      openId: openid
                    },
                    method: 'post',
                    success: function (res) {
                      console.log(res)
                      app.globalData.sysWXUser = res.data.sysWXUser
                      app.globalData.admin = res.data.admin
                    }
                  })
                  wx.switchTab({
                    url: '../record/record',
                  })
                }
              },
              fail: function () {
                console.log("fail")
              }
            })
          }
        })
        
      } else {
        console.log('获取用户登录态失败：' + res.errMsg);
      }
    }
  })
}
let isEmptyObject = (obj) => {
  for (let i in obj) {
    return false
  }
  return true
}

module.exports = {
  formatTime: formatTime,
  getCode: getCode,
  checkForm: checkForm,
  JsonToArray: JsonToArray,
  login: login,
  isEmptyObject: isEmptyObject,
  getPicker: getPicker,
  getPickerList: getPickerList,
  formatDay: formatDay
}
