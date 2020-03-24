import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ViewPagerAndroid,
  StatusBar
} from 'react-native'
import { connect } from 'react-redux'

import SwipeScr from './SwipeScr'
import Dots from './Dots'

export class AppInto extends Component {
  // static propTypes = {
  //   userdefaults: React.PropTypes.object,
  //   setUserDefaultValue: React.PropTypes.func
  // }
  constructor (props) {
    super(props)
    this.state = {
      userdefaults: {
        Hello: ''
      }
    }
    this.onPageSelected = this.onPageSelected.bind(this)
  }

  onPageSelected (e) {
    this._Dots.setNativeProps({activeDot: e.nativeEvent.position})
  }

  render () {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={'#000'}
          barStyle='default'
        />
        <ViewPagerAndroid style={styles.pager}
          initialPage={0}
          onPageSelected={this.onPageSelected} >
          <View><SwipeScr screenNo={1} /></View>
          <View><SwipeScr screenNo={2} /></View>
          <View><SwipeScr screenNo={3} /></View>
          <View><SwipeScr screenNo={4} {...this.props} /></View>
        </ViewPagerAndroid>
        <Dots
          ref={component => {
            this._Dots = component
          }} />
      </View>
    )
  }
}

function bindAction (dispatch) {
  return { }
}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps, bindAction)(AppInto)


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  pager: {
    flex: 1
  }
})
