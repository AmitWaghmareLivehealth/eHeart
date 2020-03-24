import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

import { Global, Color } from '../../../utils'

export default class Dots extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeDot:0
    }
    this.setNativeProps = this.setNativeProps.bind(this)
  }
  setNativeProps(nativeProps){
    this.setState({
      activeDot : nativeProps.activeDot
    })
  }
  render(){
    let a = null
    let b = null
    let c = null
    let d = null
    let dotBgStyle = null
    switch(this.state.activeDot){
      case 0:
        a = <View style={styles.activeDot}/>
        b = <View style={styles.dots}/>
        c = <View style={styles.dots}/>
        d = <View style={styles.dots}/>
        dotBgStyle = styles.pagination
        break
      case 1:
        a = <View style={styles.dots}/>
        b = <View style={styles.activeDot}/>
        c = <View style={styles.dots}/>
        d = <View style={styles.dots}/>
        dotBgStyle = styles.pagination
        break
      case 2:
        a = <View style={styles.dots}/>
        b = <View style={styles.dots}/>
        c = <View style={styles.activeDot}/>
        d = <View style={styles.dots}/>
        dotBgStyle = styles.pagination
        break
      default:
        a = null
        b = null
        c = null
        d = null
        dotBgStyle = styles.viewHidden
      }
      return (
        <View
          style={dotBgStyle}>
          {a}{b}{c}{d}
        </View>
      )
  }
}
const styles = StyleSheet.create({
  pagination: {
    height: Global.screenHeight * 0.12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  viewHidden: {
    flexDirection: 'row',
    height: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  dots : {
    backgroundColor:'darkgray',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 20
  },
  activeDot : {
    backgroundColor: Color.themeColor,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginBottom: 20
  },
})
