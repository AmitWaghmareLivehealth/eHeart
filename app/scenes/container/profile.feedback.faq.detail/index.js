import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types';
import { Routes, Color, Global } from '../../../utils'

import styles from './styles'

export default class FAQDetail extends Component {

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

FAQDetail.propTypes = {
  var1: PropTypes.string
}

FAQDetail.defaultProps = {
  var1: ''
}
