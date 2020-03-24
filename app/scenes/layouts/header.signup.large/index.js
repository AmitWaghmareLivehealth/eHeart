import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native'

export default class HeaderSignUpLarge extends Component {
  render () {
    return (
      <View style={[styles.containerMain, this.props.style]}>
        <Text style={styles.textHeader}>{this.props.header}</Text>
        <Text style={styles.textDesc}>{this.props.description}</Text>
      </View>
    )
  }
}

HeaderSignUpLarge.propTypes = {
  header: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.element,
  style: PropTypes.object
}

const styles = StyleSheet.create({
  containerMain: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 36,
    paddingTop: 48
  },
  textHeader: {
    flexGrow: 2,
    textAlignVertical: 'bottom',
    fontSize: 22,
    fontWeight: '400'
  },
  textDesc: {
    flexGrow: 2,
    paddingTop: 10,
    fontSize: 14
  },
  containerActions: {
    alignContent: 'flex-end'
  }
})
