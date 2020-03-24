import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native'
const CARD_WIDTH = Dimensions.get('window').width
import { themeColor, disableButtonColor } from './../../../utils'
export default class RoundedButton extends Component {
  constructor(props) {
    super(props)
    this.buttonPress = this.buttonPress.bind(this)
    this.buttonPressOut = this.buttonPressOut.bind(this)
  }
  buttonPress(){
    this._Button.setNativeProps({style:{backgroundColor:'#57E66E'}});
  }
  buttonPressOut(){
    this._Button.setNativeProps({style:{backgroundColor:themeColor}});
  }
  render(){
    return(
      <TouchableOpacity
      onPress={(this.props.isDisable) ? null : this.props.onPress}
      activeOpacity={(this.props.isDisable==true) ? 1.0 : 1.0}
      onPressIn={(this.props.isDisable==true) ? null : this.buttonPress}
      onPressOut={(this.props.isDisable==true) ? null : this.buttonPressOut} >
        <View style={[{
          height : 40,
          width : CARD_WIDTH*(3/4),
          alignItems:'center',
          justifyContent :'center',
          backgroundColor :(this.props.isDisable==undefined) ? disableButtonColor : themeColor,
          borderRadius: 20
        }, this.props.style]}
        ref = {component => this._Button = component}>
          <Text style={[{
            textAlign : 'center',
            color : (this.props.textColor==undefined) ? 'white' : this.props.textColor,
            fontSize : this.props.textFont==undefined ? 15 : this.props.textFont,
          }, this.props.titleStyle]}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
