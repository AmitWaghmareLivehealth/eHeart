import Geocoder from 'react-native-geocoder';
import {
  ToastAndroid,
} from 'react-native';
import _RESTRequest from '../handlers/network'
import Global from '../const/globals'

export async function getNameFromLocation(latitude: String, longitude: String, updateLocation, place){
  var finalres = {}
  if(Global.iOSPlatform ? (place ? place.address : false) : true ){
    geocoderRun(latitude, longitude, updateLocation, place)
  } else {
    var _this = undefined
    var params = {}
    return _RESTRequest(_this,'POST', "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude +","+ longitude +"&sensor=true", params)
    .then((result1) => {
      if(result1 && result1.response.results.length > 0){
        var postal_code = ''
        var area = ''
        var city = ''
        var state = ''
        var result = result1.response.results

        result[0].address_components.forEach((valInData) => {
          if(valInData.types.includes("postal_code")){
           postal_code = valInData.long_name
          } else if(valInData.types.includes("sublocality_level_1")){
            area = valInData.long_name
          } else if(valInData.types.includes("administrative_area_level_2")){
            city = valInData.long_name
          } else if(valInData.types.includes("administrative_area_level_1")){
            state = valInData.long_name
          }
        })
        finalres = {
          formattedAddress: result[0].formatted_address,
          area: area,
          city : city,
          state: state,
          postalCode : postal_code,
          latitude: place ? place.latitude : latitude,
          longitude: place ? place.longitude : longitude
        }

        updateLocation(finalres)
      } else {
        geocoderRun(latitude, longitude, updateLocation, place)
      }
      return result
    }).catch(error => {
      geocoderRun(latitude, longitude, updateLocation, place)
      console.log(error)
    })
  }

}


async function geocoderRun(latitude , longitude, updateLocation, place){
  var finalres = {}
  Geocoder.geocodePosition({lat: latitude, lng: longitude}).then(result => {
    // res is an Array of geocoding object (see below)
    console.log(result);
    if(result.length > 0){
      finalres = {
        formattedAddress: place ? (place.name.indexOf('°') === -1 ? place.name + ", "+ place.address : result[0].formattedAddress) : result[0].formattedAddress,
        area: result[0].subLocality,
        city : result[0].subAdminArea,
        state: result[0].adminArea,
        postalCode : result[0].postalCode,
        latitude: place ? place.latitude : latitude,
        longitude: place ? place.longitude : longitude
      }
    }
    updateLocation(finalres)
})
.catch(err => console.log(err))

 return finalres
}
