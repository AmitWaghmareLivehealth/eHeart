import React, { Component } from 'react'
import { View, Text, StyleSheet, Modal, Image, ActivityIndicator} from 'react-native'
import {Color, Images, Global} from '../../../utils'
import {Bars} from 'react-native-loader';

export default class ProgressBar extends Component{
  render(){
    return(
      <Modal
         animationType={'none'}
         transparent={true}
         visible={true}
         onRequestClose = {() => { }}
         >
        <View  style={{flex:1,alignItems : 'center',justifyContent: 'center',backgroundColor: '#00000030'}}>
          <ActivityIndicator
          color={Color.themeColor}
          size={Global.iOSPlatform ? 1 : 56} />
        </View>
      </Modal>
      // (Global.iOSPlatform) ? (<ActivityIndicator/>) : (<ProgressBar/>)
      // <ProgressBar/>
    )
  }
}
