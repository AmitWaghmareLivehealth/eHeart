// import PushNotification from 'react-native-push-notification'
import NetworkRequest from '../handlers/network'
import { URLs } from '../const/urls'
import * as CommonManager from '../managers/common.manager'
import UserDefaults from '../handlers/localstorage'
import Global from '../const/globals'
import { stringsNotifications, stringsUserDefaults } from '../const/strings'
// import {NotificationsAndroid} from 'react-native-notifications';

export function regLiveHealthServer (gcmOrAPN, token, _this) {
  var params = ''
  var url = ''
  if (Global.iOSPlatform) {
    url = URLs.regDeviceAPN
    params = 'apnsId='
  } else {
    url = URLs.regDeviceGCM
    params = 'gcmId='
  }
  console.log('APN: ', gcmOrAPN)
   NetworkRequest(_this, 'POST', url + token + '/', params + gcmOrAPN)
    .then((result) => {
      if (!CommonManager.isPositiveResult(result)) {
        result.success = false
      }
      console.log('Livehealth Server Remote Notification Reg Success: ' + result.success + 'Obj: ', result)
      return result
    }).catch(CommonManager.handleErrorWithEmptyResponse)
}

function unregLiveHealthServer () {
  var lthUnregStatus = UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    var params = 'userToken=' + (token || '')
    var url = ''
    if (Global.iOSPlatform) {
      url = URLs.unRegDeviceAPN
    } else {
      url = URLs.unRegDeviceGCM
    }
    return
    var _this = ''
    NetworkRequest(_this, 'POST', url + token + '/', params)
      .then((result) => {
        if (!CommonManager.isPositiveResult(result)) {
          result.success = false
        }
        return result
      }).catch(CommonManager.handleErrorWithEmptyResponse)
  }).catch(CommonManager.handleErrorWithEmptyResponse)
  console.log('Livehealth Server Remote Notification unReg Success: ' + lthUnregStatus.success + 'Obj: ', lthUnregStatus)
}

export function unregAllNotifications () {
  // PushNotification.abandonPermissions()
  // PushNotification.cancelAllLocalNotifications()
  unregLiveHealthServer()
}

function handleNotification (notification) {
  /* Set Application Badge - iOS Full android Partial Support */
  console.log('**** ** *** Notification: ', notification)
  // PushNotification.getApplicationIconBadgeNumber(function (number) {
  //   if (number) {
  //     if (number <= 0) {
  //       PushNotification.setApplicationIconBadgeNumber(1)
  //     } else {
  //       PushNotification.setApplicationIconBadgeNumber(number + 1)
  //     }
  //   }
  // })

  if(notification.userInteraction){
    if(notification.category === stringsNotifications.GCMCAT_NEW_REPORT || notification.category === stringsNotifications.GCMCAT_APP_UPDATE){
     UserDefaults.set(stringsUserDefaults.notificationFlag, true)
     UserDefaults.set(stringsUserDefaults.notificationJson, notification)
    }
  }

  /* Handle Notification */
  /*
    * notification = {
          foreground: false, // BOOLEAN: If the notification was received in foreground or not
          userInteraction: false, // BOOLEAN: If the notification was opened by the user from the notification area or not
          message: 'My Notification Message', // STRING: The notification message
          data: {}, // OBJECT: The push data
      }
    *
  */
}

export function init (token) {
  // PushNotification.configure({
  //   // (optional) Called when Token is generated (iOS and Android)
  //   onRegister: function (gcmOrAPNId) {
  //     console.log('TOKEN: ', gcmOrAPNId)
  //     regLiveHealthServer(gcmOrAPNId, token)
  //   },
  //
  //   // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  //   senderID: stringsNotifications.GOOGLE_PROJECT_ID,
  //
  //   // (required) Called when a remote or local notification is opened or received
  //   onNotification: function (notification) {
  //     console.log('NOTIFICATION: ', notification)
  //     handleNotification(notification)
  //   }
  // })

  // NotificationsAndroid.setRegistrationTokenUpdateListener((deviceToken) => {
  //   UserDefaults.get(stringsUserDefaults.gcmId).then((gcmId) => {
  //     if (!gcmId){
  //       UserDefaults.set(stringsUserDefaults.gcmId, deviceToken)
  //   	  console.log('Push-notifications registered!', deviceToken)
  //     }
  //   }).catch((error) => {
  //     console.error(error);
  //   })
  // });

  // NotificationsAndroid.setNotificationReceivedListener((notification) => {
	//   console.log("Notification received on device", notification.getData());
  // });
  //
  // NotificationsAndroid.setNotificationOpenedListener((notification) => {
  // 	console.log("Notification opened by device user", notification.getData());
  // });
}
