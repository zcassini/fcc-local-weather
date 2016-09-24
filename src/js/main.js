global.$ = global.jQuery = require('jquery')
var foundation = require('../../node_modules/foundation-sites/dist/foundation.js')
$(document).foundation()

var gkey = '&key=AIzaSyBBpaZOR5ZnKTBDfZYT3kuAi-bS_e8gHPo'
var fIcon = "<i class='wi wi-fahrenheit'></i>"
var cIcon = "<i class='wi wi-celsius'></i>"
getGeo()

$('Input[type=radio]').change(function (e) {
  var temp = $('#temp')
  temp.html(this.id === 'fahrenheit' ? toCelcius(temp.text()) + cIcon : toFahrenheit(temp.text()) + fIcon)
})

function getWeather (latitude, longitude) {
  var url = 'https://api.forecast.io/forecast/d8f4a1ce8e7d5acad8d319e14d7c2a20/' + latitude + ',' + longitude + '?exclude=minutely, hourly, daily, alerts, flags&units=us'
  setCity(latitude, longitude)
  $.ajax({
    url: url,
    dataType: 'jsonp',
    success: function (json) {
      var currently = json.currently
      $('#temp').html(currently.temperature.toFixed(0) + fIcon)
      $('#summary').text(currently.summary)
      $('#icon').html("<i class='wi wi-forecast-io-" + currently.icon + "'></i>")
    },
    error: function (e) {
      console.log(e.message)
    }
  })
}

function getGeo () {
  var output = $('#temp')
  if (!navigator.geolocation) {
    output.innerHTML = '<p>Geolocation is not supported by your browser</p>'
    return
  }

  function success (position) {
    var latitude = position.coords.latitude
    var longitude = position.coords.longitude
    getWeather(latitude, longitude)
  }

  function error () {
    output.innerHTML = 'Unable to retrieve your location.'
  }

  output.innerHTML = '<p>Locating…</p>'
  navigator.geolocation.getCurrentPosition(success, error)
}

function setCity (latitude, longitude) {
  var geocodingAPI = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + gkey
  var city = 'Unknown '
  $.ajax({
    url: geocodingAPI,
    success: function (json) {
      for (let result of json.results[0].address_components) {
        if (result.types.indexOf('locality') >= 0) city = result.short_name
        if (result.types.indexOf('administrative_area_level_1') >= 0) city += ', ' + result.short_name
        $('#city').text(city)
      }
    },
    error: function (e) {
      console.log(e.message)
    }
  })
}

function toFahrenheit (temp) {
  return ((temp - 32) * (5 / 9)).toFixed(0)
}

function toCelcius (temp) {
  return (temp * 1.8 + 32).toFixed(0)
}
