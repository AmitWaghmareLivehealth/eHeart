import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types';
import { Routes, Color, Global } from '../../../utils'

import styles from './styles'

export default class Screen extends Component {

  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {

  }

  render () {
    return (
      <View style={styles.containerMain}>
      </View>
    )
  }
}

Screen.propTypes = {
  var1: PropTypes.string
}

Screen.defaultProps = {
  var1: ''
}
