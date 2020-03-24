import React, { Component } from 'react'
import { Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';
import { Global, CommonStyles } from '../../../utils'

export default class Error extends Component {
  render () {
    return (
      <Text style={[CommonStyles.textError, styles.textErrorMsg, this.props.style, {color: (this.props.invalidMessageVisible ? this.props.errorColor : this.props.nonErrorColor)}]}>{this.props.message}</Text>
    )
  }
}

Error.propTypes = {
  invalidMessageVisible: PropTypes.bool,
  message: PropTypes.string,
  style: PropTypes.object,
  errorColor: PropTypes.string,
  nonErrorColor: PropTypes.string
}

Error.defaultProps = {
  invalidMessageVisible: false,
  message: '',
  style: {},
  errorColor: 'red',
  nonErrorColor: 'white'
}

const styles = StyleSheet.create({
  textErrorMsg: {
    width: Global.screenWidth * 0.8,
    marginTop: 12,
    height: 20,
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 12
  }
})
