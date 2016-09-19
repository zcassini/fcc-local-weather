global.$ = global.jQuery = require('jquery')
var foundation = require('../../node_modules/foundation-sites/dist/foundation.js')
$(document).foundation()

var gkey = '&key=AIzaSyBBpaZOR5ZnKTBDfZYT3kuAi-bS_e8gHPo'
var units = 'us'

getGeo()

$('Input[type=radio]').change(function (e) {
  units = this.id === 'fahrenheit' ? 'us' : 'si'
  getGeo()
})

function getWeather (latitude, longitude) {
  var url = 'https://api.forecast.io/forecast/d8f4a1ce8e7d5acad8d319e14d7c2a20/' + latitude + ',' + longitude + '?exclude=minutely, hourly, daily, alerts, flags&units=' + units
  var city = getCity(latitude, longitude)
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: function (json) {
      var currently = json.currently
      units === 'si'
        ? $('#temp').html(currently.temperature + "<i class='wi wi-celsius'></i>")
        : $('#temp').html(currently.temperature + "<i class='wi wi-fahrenheit'></i>")
      $('#summary').text(currently.summary)
      $('#icon').html("<i class='wi wi-forecast-io-" + currently.icon + "'></i>")
      $('#city').text(city)
    },
    error: function (e) {
      console.log(e.message)
    }
  })
}

function getGeo () {
  var output =  $('#temp')
  if (!navigator.geolocation) {
    output.innerHTML = '<p>Geolocation is not supported by your browser</p>'
    return
  }

  function success (position) {
    var latitude = position.coords.latitude
    var longitude = position.coords.longitude
    console.log(longitude + ' ' + latitude)

    getWeather(longitude, latitude)
  };

  function error () {
    output.innerHTML = 'Unable to retrieve your location'
  }

  output.innerHTML = '<p>Locating…</p>'

  navigator.geolocation.getCurrentPosition(success, error)
}

function getCity (latitude, longitude) {
  var geocodingAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude +  gkey
   // var geocodingAPI = 'https://maps.googleapis.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=13&size=300x300&sensor=false&key=AIzaSyBBpaZOR5ZnKTBDfZYT3kuAi-bS_e8gHPo'
  console.log('huhuhu')
  $.getJSON(geocodingAPI, function (json) {
    console.log('oh hai')
    console.log(json)
    if (json.status === 'OK') {
      // Check result 0
      var result = json.results[0]
      // look for locality tag and administrative_area_level_1
      var city = ''
      var state = ''
      for (var i = 0, len = result.address_components.length; i < len; i++) {
        var ac = result.address_components[i]
        if (ac.types.indexOf('administrative_area_level_1') >= 0) state = ac.short_name
        if (ac.types.indexOf('locality') >= 0) city = ac.short_name
      }
      // for (let res of result.address_components) {
      //   if (res.types.indexOf('administrative_area_level_1') >= 0) state = res.short_name
      //   if (res.types.indexOf('locality') >= 0) city = res.short_name
      // }
      console.log(city + state)
      return city + ',' + state
    }
  })
}
