Component({
  properties: {
    list: {
      type: Array,
      value: []
    },
  },
  methods: {
    makeCall(e) {
      var that=this
      console.log(e.currentTarget.dataset.index)
      var i = e.currentTarget.dataset.index
      wx.showModal({
        title: '提示',
        content: '您确定给' + that.data.list[i].personName +'拨打电话吗？',
        success: function(res){
          if(res.confirm){
            wx.makePhoneCall({
              phoneNumber: that.data.list[i].phoneNum
            })
          }
        }
      }) 
    },
  },
})