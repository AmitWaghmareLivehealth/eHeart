/*
 * @flow
*/

import React, { Component } from 'react'
import { StatusBar, Animated, Modal, Text, Easing, processColor, View } from 'react-native'
import Global from './utils/const/globals'

import AppNavigator from './appnavigator'
// import AppNavigator from './scenes/container/login.signup.password'
import TrackerCategories from './scenes/container/tracker.category.list'
import TrackerSubCategories from './scenes/container/tracker.subcategories'
import TrackerDetails from './scenes/container/tracker.details'
import TrackerAddition from './scenes/container/tracker.addition'
import TrackerList from './scenes/container/tracker.list'
import BasicProfile from './scenes/container/profile.basic'
import Profile from './scenes/container/profile.profile'
import Preference from './scenes/container/profile.preference'
import Screen from './scenes/container/report.view'
import AutomatedTrackers from './scenes/container/automated.tracker'
import NotificationPreferences from './scenes/container/profile.notification.prefs'
import AboutUs from './scenes/container/profile.about_us'
import DialogHeader from './scenes/components/dialog.header'
import BlankScreen from './scenes/container/home.home'
import DummyCard from './scenes/components/dummycard'
import PendingReportView from './scenes/container/pending.reportview'
import DatePicker from './scenes/components/datepicker'
import LoginSignupBDayScreen from './scenes/container/login.signup.bdate'
import Feedback from './scenes/container/feedback'
import AppointmentSummary from './scenes/container/appointmentSummary'
import Receipt from './scenes/container/receipt'
import TimeSlots from './scenes/container/time.slots'
import TipsTricks from './scenes/container/tips.tricks'
import { init } from './utils/handlers/notification.remote'
// import NotificationsIOS from 'react-native-notifications';
import {UserDefaults, stringsUserDefaults} from './utils'
//import PushNotification from 'react-native-push-notification'


class App extends Component {

  constructor (props) {
    super(props)
    this.state = {
      color:'#fff',
      notificationVisibility: true,
      fadeOpacity: new Animated.Value(0),
      fadeHeight: new Animated.Value(0)
    }
    //  NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
    //   NotificationsIOS.addEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));

    if(Global.iOSPlatform){ 
      // NotificationsIOS.addEventListener('remoteNotificationsRegistered', this.onPushRegistered.bind(this));
      // NotificationsIOS.addEventListener('remoteNotificationsRegistrationFailed', this.onPushRegistrationFailed.bind(this));
      // NotificationsIOS.requestPermissions();
      // NotificationsIOS.consumeBackgroundQueue();
    } else {
      init()
    }

   
    this.showNotification = this.showNotification.bind(this)
  }

  

  onPushRegistered(deviceToken) {
    UserDefaults.get(stringsUserDefaults.gcmId).then((gcmId) => {
      if (!gcmId){
        UserDefaults.set(stringsUserDefaults.gcmId, deviceToken)
    	  console.log('Push-notifications registered!', deviceToken)
      }
    }).catch((error) => {
      console.error(error);
    })
  }

  
	onPushRegistrationFailed(error) {
		// For example:
		//
		// error={
		//   domain: 'NSCocoaErroDomain',
		//   code: 3010,
		//   localizedDescription: 'remote notifications are not supported in the simulator'
		// }
		console.error(error);
	}

	componentWillUnmount() {
    try {
  		// prevent memory leaks!
  		// NotificationsIOS.removeEventListener('remoteNotificationsRegistered', this.onPushRegistered.bind(this));
      // NotificationsIOS.removeEventListener('remoteNotificationsRegistrationFailed', this.onPushRegistrationFailed.bind(this));

      // // Don't forget to remove the event listeners to prevent memory leaks!
      // NotificationsIOS.removeEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
      // NotificationsIOS.removeEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
      // NotificationsIOS.removeEventListener('notificationOpened', this.onNotificationOpened.bind(this));
    } catch(error){
      console.error(error);
    }
  }
  
//   onNotificationReceivedBackground(notification){
//   console.log('BACKGROUND MAI', notification)
//  // PushNotificationIOS.setApplicationIconBadgeNumber(5)
//   PushNotificationIOS.getDeliveredNotifications((callback)=>{
//     console.log('Callback: ', callback)
//   })
    
   
//   PushNotificationIOS.getApplicationIconBadgeNumber((number)=>{

  
//     if (number <= 0) {
//       PushNotificationIOS.setApplicationIconBadgeNumber(1)
//     } else {
//       PushNotificationIOS.setApplicationIconBadgeNumber(number + 1)
//     }

//   //   if(number == 3){
//   //     NotificationsIOS.removeEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
//   //     NotificationsIOS.removeEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
//   //  //   NotificationsIOS.removeEventListener('notificationOpened', this.onNotificationOpened.bind(this));
//   //  NotificationsIOS.removeEventListener('remoteNotificationsRegistered', this.onPushRegistered.bind(this));

//   //   }

// });

// //   PushNotificationIOS.getApplicationIconBadgeNumber((callback)=>{

// //     console.log('CALLBACK: ', callback)
// //   });

// //   // NotificationsIOS.setBadgesCount(2);
// //   // PushNotification.setApplicationIconBadgeNumber(3)
// //  // PushNotificationIOS.setApplicationIconBadgeNumber(5)

// //   NotificationsIOS.getBadgesCount((count) => console.log(count));
// //   PushNotification.getApplicationIconBadgeNumber(function (number) {
// //     if (number) {
// //       if (number <= 0) {
// //         PushNotification.setApplicationIconBadgeNumber(1)
// //       } else {
// //         PushNotification.setApplicationIconBadgeNumber(number + 1)
// //       }
// //     }
// //   })

//   }

//   onNotificationReceivedForeground(){
//     console.log('FOREGROUND MAI')
    
//     PushNotificationIOS.getDeliveredNotifications((callback)=>{
//       console.log('Callback: ', callback)
//     })

//     PushNotificationIOS.getApplicationIconBadgeNumber((number)=>{
      
//         if (number <= 0) {
//           PushNotificationIOS.setApplicationIconBadgeNumber(1)
//           NotificationsIOS.setBadgesCount(1);
//           PushNotification.setApplicationIconBadgeNumber(1)



//         } else {
//           PushNotificationIOS.setApplicationIconBadgeNumber(number + 1)
//           NotificationsIOS.setBadgesCount(number + 1);
//           PushNotification.setApplicationIconBadgeNumber(number+1)



//         }

//       //   if(number == 3){
//       //     NotificationsIOS.removeEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
//       //     NotificationsIOS.removeEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
//       //  //   NotificationsIOS.removeEventListener('notificationOpened', this.onNotificationOpened.bind(this));
//       //  NotificationsIOS.removeEventListener('remoteNotificationsRegistered', this.onPushRegistered.bind(this));

//       //   }

//     });
  


//   }

  componentDidMount () {
    this.showNotification()
  }

  showNotification () {
    Animated.timing(
      this.state.fadeOpacity,
      {
        toValue: this.state.notificationVisibility ? 1 : 0.7,
        duration: 2000,
        easing: Easing.linear
      }
    )
    Animated.timing(
      this.state.fadeHeight,
      {
        toValue: this.state.notificationVisibility ? 100 : 80,
        duration: 2000,
        easing: Easing.linear
      }
    )
  }

  _renderNotificationModal () {
    var { fadeOpacity, fadeHeight } = this.state
    return (
      <Modal
        ref='modal'
        animationType={'none'}
        transparent
        onRequestClose={() => {
          this.setState({ notificationVisibility: false })
        }}
      >
        <Animated.View                 // Special Animate-ble View
          style={{
            opacity: fadeOpacity,        // Bind opacity to animated value
            height: fadeHeight,
            width: Global.screenWidth,
            padding: 32
          }}
        >
  <Text>{Global.labName}</Text>
          <Text>This is message</Text>
        </Animated.View>
      </Modal>
    )
  }

  render () {
    return (
      // <Scale/>
      // <TrackerList/>

      <AppNavigator>
        <StatusBar
          backgroundColor={'#000'}
          barStyle='default'
        />
      </AppNavigator>

    )
  }
}
export default App
