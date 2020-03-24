import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { Routes, Color, Global } from '../../../utils'

export default class ReportListIndividual extends Component {
  static propTypes = {
    var1: PropTypes.string
  }

  static defaultProps = {
    var1: ''
  }

  static navigationOptions = {
    tabBarLabel: this.props || {}.title || '',
  }

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
        <Text>{this.props || {}.title || ''}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: 'white'
  }
})
