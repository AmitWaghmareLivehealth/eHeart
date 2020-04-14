export type NetworkRequest = 'POST' | 'GET'
import { URLs } from '../const/urls'
import Globals from '../const/globals'
import RNFetchBlob from 'react-native-fetch-blob'
import { stringsUserDefaults } from './../const/strings'
import UserDefaults from './localstorage'
import Routes from '../const/routes'
import { handleErrorWithResponseCode } from '../managers/common.manager'
import { logout } from '../managers/login.manager'
import { NavigationActions } from 'react-navigation'

export default async function RESTRequest ( _this,method: NetworkRequest, url:string, params:string = ''):Promise<Response> {
  return UserDefaults.get(stringsUserDefaults.networkConnectionStatus)
  .then(isConnected => {

    // if (isConnected) {
      var options = {
        method: method
      }
      if (method === 'POST') {
        options.headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Connection': 'close',
          'Content-length': (params + URLs.devId).length
        }
        options.body = params + URLs.devId + '&appVersion=' + Globals.appVersion
      } else {
        options.headers = {
          'content-type': 'application/json',
          'connection': 'close'
        }
      }
      console.log(url + params)
      return fetch(encodeURI(url), options)
      .then((response) => {
        console.log(response)
        return response.json()
      }).then((responseJson) => {
        console.log(responseJson)
        try {
          if(url.indexOf(URLs.unRegDeviceCGM) === -1){
            if(responseJson.code === 404){
              UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
                  if(token){
                    logout(_this)
                    const resetAction = NavigationActions.reset({
                      index: 0,
                      key: null,
                      actions: [
                        NavigationActions.navigate({
                          routeName: Routes.loginScreen
                        })
                      ]
                    })
                    if(_this){
                      _this.props.navigation.dispatch(resetAction)
                    }
                  }
              }).catch((error) => {
                console.error(error);
              })
            }
          }
        } catch(error){ console.error(error); }
        return { success: true, response: responseJson }
      }).catch(error => handleErrorWithResponseCode(error, 107))
    // } else {
    //   return handleErrorWithResponseCode('error', 109)
    // }
  }).catch(error =>{ 
    console.log(error)
    handleErrorWithResponseCode(error, 109)})
}
