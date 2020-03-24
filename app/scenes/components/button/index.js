import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import Button from './react-native-button'

import { Global, Color } from '../../../utils'

export default class ButtonNew extends Component {
  render () {
    return (
      <Button
      isDisabled ={this.props.disabled}
        style={[styles.default, this.props.style]}
        textStyle={[styles.textBtnTitle, this.props.titleStyle]}
        {...this.props}
      >
        {this.props.title}
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  default: {
    // flex: 1,
    backgroundColor: Color.greenPrimary,
    height: 46,
    margin: 16,
    width: Global.screenWidth * 0.8,
    borderColor: Color.greenPrimary,
    alignSelf: 'center',
    borderRadius: 4
  },
  textBtnTitle: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontWeight: '700'
  }
})
