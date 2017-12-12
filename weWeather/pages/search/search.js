//获取应用实例

const app = getApp()
Page({
  data:{
    isLoaded:false,
    city: "北京",
    appKey: "a0c624c18a2dc28dbddc2ec42239dd94",
    showCity: "",
    tmp: "",//温度
    condTxt: "",//天气情况描述
    condCode: "",
    windDir: "",//风向
    windSpd: "",//风力等级
    hum: "",//湿度
    qlty: "",//空气质量
    pm25: "",//PM2.5
    dailyForecast: "",//后七天天气
    suggestionComf: "",//舒适度
    suggestionCw: "",//洗车
    suggestionDrsg: "",//穿衣
    suggestionFlu: "",//感冒
    suggestionSport: "",//运动
    suggestionTrav: "",//旅游
    suggestionUv: "",//紫外线
    second_height: ""
  },
  callBack: function (data) {
    console.log(data.result.HeWeather5[0].basic);
    this.setData({
      showCity: data.result.HeWeather5[0].basic.city,
      tmp: data.result.HeWeather5[0].now.tmp,
      condTxt: data.result.HeWeather5[0].now.cond.txt,
      condCode: data.result.HeWeather5[0].now.cond.code,
      windDir: data.result.HeWeather5[0].now.wind.dir,
      windSpd: data.result.HeWeather5[0].now.wind.spd,
      hum: data.result.HeWeather5[0].now.hum,
      qlty: data.result.HeWeather5[0].aqi.city.qlty,
      pm25: data.result.HeWeather5[0].aqi.city.pm25,
      dailyForecast: data.result.HeWeather5[0].daily_forecast,
      suggestionComf: data.result.HeWeather5[0].suggestion.comf,
      suggestionCw: data.result.HeWeather5[0].suggestion.cw,
      suggestionDrsg: data.result.HeWeather5[0].suggestion.drsg,
      suggestionFlu: data.result.HeWeather5[0].suggestion.flu,
      suggestionSport: data.result.HeWeather5[0].suggestion.sport,
      suggestionTrav: data.result.HeWeather5[0].suggestion.trav,
      suggestionUv: data.result.HeWeather5[0].suggestion.uv,
    })
  },
  onLoad: function(){
    /*this.setData({
      city: options.city
    })*/
    //this.weatherRequest();
    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        that.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - 310
        })
      }
    })

    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.locationRequest(res);
      }
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    if (this.data.isLoaded){
      this.weatherRequest();
      console.log(this.data.city);
    }
    
    
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  //跳转到切换城市页面
  changeCity: function(){
    if (this.data.isLoaded){
      wx.navigateTo({
        url: '../weather_list/weather_list?city=' + this.data.city,
      })
    }
    
  },
  //处理网络请求函数
  weatherRequest: function(){
    var that = this;
    //京东万象接口 https://wx.jcloud.com/market/datas/26/10610
    wx.request({
      url: 'https://way.jd.com/he/freeweather?city=' + this.data.city + '&appkey=' + this.data.appKey,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.callBack(res.data);
      }
    })
  },
  locationRequest: function(e){
    var latitude = e.latitude;
    var longitude = e.longitude;
    var that = this;
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=NigyldM7s4mwLLwHwVrGgDKQoIHriS3R&location=' + latitude + ',' + longitude+'&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success    
        console.log(res);
        var city = res.data.result.addressComponent.city;
        that.setData({
          city: res.data.result.addressComponent.city,
          isLoaded: true
        })
        that.weatherRequest();
        //page.setData({ currentCity: city });
      },
      fail: function () {
        //page.setData({ currentCity: "获取定位失败" });
      },

    })
  }
})