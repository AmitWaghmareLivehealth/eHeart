import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import { Routes, Color, Global } from '../../../utils'
import PropTypes from 'prop-types'
import { CommonStyles, extString } from '../../../utils'

import Ripple from '../ripple'

export default class ButtonTextOnly extends Component {
  static propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    isEnabled: PropTypes.bool,
    onPress: PropTypes.func,
    color: PropTypes.string
  }

  static defaultProps = {
    title: '',
    style: {},
    titleStyle: {},
    isEnabled: true,
    onPress: () => {},
    color: 'black'
  }

  render () {
    return (
      <Ripple style={[styles.containerMain, this.props.style]}
        onPress={this.props.isEnabled ? this.props.onPress : () => {}}
      >
        <Text style={[CommonStyles.button_style, this.props.titleStyle, { color: this.props.isEnabled ? (this.props.color) : Color._9BGrayOnGray }]}>{(this.props.title || '')}
        </Text>
      </Ripple>
    )
  }
}

const styles = StyleSheet.create({
  containerMain: {
    backgroundColor: 'white',
    height: 30,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 4
  }
})
