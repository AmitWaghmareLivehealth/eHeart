import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Color } from '../../../utils'

export default class Separator extends Component {
  render () {
    return <View style={[styles.containerMain, this.props.style]} />
  }
}

Separator.propTypes = {
  style: PropTypes.object
}

Separator.defaultProps = {
  style: { height: 0.5, backgroundColor: Color._DF }
}

const styles = StyleSheet.create({
  containerMain: {
    height: 0.5,
    backgroundColor: Color._DF
  }
})
