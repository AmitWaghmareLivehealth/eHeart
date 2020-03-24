import React, { Component } from 'react'
import { TextInput, StyleSheet, Text, View, TouchableOpacity} from 'react-native'

import { Global } from '../../../utils'
import PropTypes from 'prop-types'


export default class TextFieldOTP extends Component {

  static defaultProps = {
    length: 6
  }

  constructor (props) {
    super(props)
    this.state = {
      length: 6,
      otp: '',
      curserPos: 0,
      size:this.props.size,
      widthOtp: this.props.widthOtp

    }
    this.onChangeText = this.onChangeText.bind(this)
    this.getFocus = this.getFocus.bind(this)
    this.getNumberSection = this.getNumberSection.bind(this)
  }

  componentDidMount () {
    let length = this.props.length || 6
    this.setState({
      length: length
    })
    if (this.props.focusOnComponentMount) {
      this.getFocus(false)
    }
  }

  onChangeText (text) {
    let numbers = '0123456789'
    var newText = ''
    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i] > -1)) {
        newText += text[i]
      }
    }
    if (this.props.setOTP) {
      this.props.setOTP(newText)
    }
    this.setState({ otp: newText })
  }

  getFocus (flag = true) {
    if (flag) {
      this.refs.otpInput1.blur()
    }
    this.refs.otpInput.focus()
  }

  getNumberSection (alphabet, key) {
    return <TextInput ref={key} key={key} style={[styles.textLableOTP, {width: Global.screenWidth / 10, height : Global.iOSPlatform ? 50 : 75,fontSize: this.state.size}]} value={alphabet} underlineColorAndroid='transparent' placeholderTextColor='black' onFocus={(() => this.getFocus()).bind(this)} keyboardType='numeric' selectionColor='transparent'
    />
  }

  render () {
    var i = 0
    let otpString = this.state.otp
    while (this.state.length > otpString.length) {
      otpString += '-'
    }
    var allElements = otpString.split('').map(((alphabet) => {
      i++
      let key = 'otpInput' + i
      if (alphabet.length > 0) {
        return this.getNumberSection(alphabet, key)
      }
    }).bind(this))
    return (
      <View style={[styles.containerMain, this.props.style]}>
        <TextInput
          ref='otpInput'
          style={[styles.inputOTP]}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.props.onSubmitEditing}
          value={this.state.otp}
          maxLength={this.state.length}
          underlineColorAndroid='transparent'
          keyboardType='numeric'
        />
        <TouchableOpacity
        style={[styles.containerLableOTP, {width: this.state.widthOtp}]}
        activeOpacity={1.0}
        hitSlop={{top: 12, left: 36, bottom: 0, right: 0}}
        onPress={(() => {
          this.refs.otpInput1.focus()

        }).bind(this)}
        >
          {allElements}
        </TouchableOpacity>
      </View>
    )
  }
}

TextFieldOTP.propTypes = {
  length: PropTypes.number,
  setOTP: PropTypes.func,
  focusOnComponentMount: PropTypes.bool
}

TextFieldOTP.defaultProps = {
  length: 6,
  focusOnComponentMount: true
}

const styles = StyleSheet.create({
  inputOTP: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 1,
    height: 0,
    width:0,
   // marginTop:10
    width: Global.screenWidth * 0.8,
  },
  textLableOTP: {
    alignSelf: 'center',
    textAlign: 'center',
    
  },
  containerLableOTP: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
    padding:5,
   
  },
  containerMain: {
    alignItems: 'center',
  }
})