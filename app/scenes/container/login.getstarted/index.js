import React, { Component } from 'react'
import {
  Text,
  Image,
  View,
  Linking,
  WebView,

} from 'react-native'
import { NavigationActions } from 'react-navigation'

import { Global, Routes, Images } from '../../../utils'
import { Button } from '../../components'
import { HeaderGetStartedSuperLarge } from '../../layouts'
import styles from './styles'

var imageWidth = Global.screenWidth * (3 / 4)
// var htmlscr = '<html><body><img src='{require(./../../../assets/ios/LiveHealthEcoSystem.gif)}' style='width:'+imageWidth+'px;height:'+imageWidth+'px'><body></html>'
export default class GetStarted extends Component {
  constructor (props) {
    super(props)
    this.onPressWatchVideo = this.onPressWatchVideo.bind(this)
    // this.onLoadEnd = this.onLoadEnd.bind(this);
  }

  onPressWatchVideo () {
    Linking.openURL('http://www.youtube.com/watch?v=415LFlqVnBQ')
     .catch(err => console.error('An error occurred', err))
  }

  render () {
    let title = 'Get Started'
    let desc = `Sign up to get all the benefits of ${Global.labName}`

    return (
      <View style={styles.container}>
        <Image source={Images.imageLivehealthLogoGif} style={styles.imageStyle} />
        <View style={styles.buttonContainer}>
          <HeaderGetStartedSuperLarge
            header={title}
            description={desc}
            style={{ flex: 0, marginTop: 0, marginBottom: 0, alignItems: 'center' }}
            headerStyle={{ textAlign: 'center' }}
            descriptionStyle={{ textAlign: 'center' }}
          />
          <Button
            style={{backgroundColor: 'white', width: 150, borderColor: 'black', marginTop: 5, alignSelf: 'center'}}
            onPress={this.onPressWatchVideo}
            title='Watch Video'
            titleStyle={{color: 'black'}}
            />
          <Button
            onPress={() => {
              const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: Routes.loginScreen
                  })
                ]
              })
              this.props.navigation.dispatch(resetAction)
            }}
            title='Lets Get Started'
          />
        </View>
      </View>
    )
  }
}
