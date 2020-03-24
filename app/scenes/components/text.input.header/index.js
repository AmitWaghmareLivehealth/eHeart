import React, { Component } from 'react'
import { StyleSheet, Text } from 'react-native'

export default class TextInputHeader extends Component {
  render () {
    return (
      <Text style={[styles.headerText, this.props.style]}>
        {this.props.children}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  headerText: { marginBottom: 5, color: '#000000' }
})
