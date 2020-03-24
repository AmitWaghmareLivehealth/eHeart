
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import App from './app'
import { stringsUserDefaults, UserDefaults } from './utils'
import NetInfo from "@react-native-community/netinfo";
import configureStore from './redux/configstore'

// import PushNotification from 'react-native-push-notification'
import { init } from './utils/handlers/notification.remote'

/*
This is entry point of app where all configurations will happen.
Ex. Sentry integration, Redux integration, Devizce information retrival and other similer stuff
<Animated.View                 // Special Animate-ble View
          style={{
            opacity: fadeOpacity,        // Bind opacity to animated value
            height: fadeHeight,
            width: Global.screenWidth,
            padding: 32
          }}
        >
user constructor to do any configurations
*/
function handleFirstConnectivityChange (isConnected) {
  UserDefaults.set(stringsUserDefaults.networkConnectionStatus, isConnected)
}

class Setup extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      store: configureStore(() => this.setState({ isLoading: false }))
    }
    // configRevan()
    // PushNotification.setApplicationIconBadgeNumber(0)
    // PushNotification.on
    // init()

    // UserDefaults.get(stringsUserDefaults.userToken).then((token) => {
    //   if(token){
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // })

  }


  componentDidMount () {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    })

    NetInfo.isConnected.addEventListener(
      'change',
      handleFirstConnectivityChange
    )
  }

  render () {
    return (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    )
  }
}
export default Setup
