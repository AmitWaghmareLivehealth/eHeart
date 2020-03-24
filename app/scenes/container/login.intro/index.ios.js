import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';

import SwipeScr from './SwipeScr'
import Dots from './Dots'
import GetStarted from '../login.getstarted'

import { Global, Images, Color } from '../../../utils'

var actDot = 0
var beginingOffset = null
var endOffset = null
var direction = null
export default class AppInto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nom : 1
    }
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this)
    this.onScrollBegin = this.onScrollBegin.bind(this)
  }
  onScrollBegin = e => {
    let dx = e.nativeEvent.contentOffset.x
    let scr1 = 0
    let scr2 = (Global.screenWidth)
    let scr3 = (Global.screenWidth) * 2
    let scr4 = (Global.screenWidth) * 3
    if (dx <= scr1){
      if (actDot!=0) {
        this._Dots.setNativeProps({activeDot:0})
        actDot=0
        return
      }
      return
    }
    if (dx <= scr2){
      if (actDot!=1) {
        this._Dots.setNativeProps({activeDot:1})
        actDot=1
        return
      }
      return
    }
    if (dx <= scr3){
      if (actDot!=2) {
        this._Dots.setNativeProps({activeDot:2})
        actDot=2
        return
      }
      return
    }
    if (dx <= scr4){
      if (actDot!=3) {
        this._Dots.setNativeProps({activeDot:3})
        actDot=3
        return
      }
      return
    }
  }
 
  onMomentumScrollEnd = e =>{
    let dx = e.nativeEvent.contentOffset.x
    let scr1 = 0
    let scr2 = (Global.screenWidth)
    let scr3 = (Global.screenWidth) * 2
    let scr4 = (Global.screenWidth) * 3
    if (dx <= scr1){
      if (actDot !== 0) {
        this._Dots.setNativeProps({activeDot:0})
        actDot = 0
        return
      }
      return
    }
    if (dx <= scr2){
      if (actDot!=1) {
        this._Dots.setNativeProps({activeDot:1})
        actDot=1
        return
      }
      return
    }
    if (dx <= scr3){
      if (actDot!=2) {
        this._Dots.setNativeProps({activeDot:2})
        actDot=2
        return
      }
      return
    }
    if (dx <= scr4){
      if (actDot!=3) {
        this._Dots.setNativeProps({activeDot:3})
        actDot=3
        return
      }
      return
    }
  }
  render(){
    return(
      <View style={styles.container}>
        <StatusBar
          backgroundColor={'#000'}
          barStyle='default'
        />
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          ref={component => this._ScrollView = component}
          horizontal={true}
          decelerationRate={'normal'}
          bounces = {false}
          pagingEnabled = {true}
          showsHorizontalScrollIndicator = {false}
          snapToAlignment="start"
          onScrollBeginDrag= {this.onScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          alwaysBounceHorizontal= {false}
        >
          <SwipeScr screenNo={1} />
          <SwipeScr screenNo={2} />
          <SwipeScr screenNo={3} />
          <GetStarted screenNo={4} {...this.props}/>
        </ScrollView>
        <Dots
        ref={component => this._Dots = component}
        activeDot={1}/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});
