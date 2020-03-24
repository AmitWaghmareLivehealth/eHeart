import React, { Component} from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

import TextInputHeader from '../text.input.header'
import { Global, CommonStyles } from '../../../utils'
import PropTypes from 'prop-types'

export default class TextFieldNumber extends Component {

  componentDidMount () {
    if (this.props.focusOnComponentMount) {
      this.refs.inputTextField.focus()
    }
  }

  render () {
    var height = this.props.height || 60
    return (
      <View style={[{ flex: 1, height: height, alignContent: 'center', justifyContent: 'center' }, this.props.style]}>
        <TextInput
          {...this.props}
          ref='inputTextField'
          style={[CommonStyles.textHeader3, styles.inputMain, this.props.inputStyle]}
          onChangeText={this.props.onChangeText}
          value={this.props.value}
          placeholder={this.props.placeholder}
          editable={this.props.editable}
          underlineColorAndroid='transparent'
        />
      </View>
    )
  }
}

TextFieldNumber.propTypes = {
  height: PropTypes.number,
  title: PropTypes.string,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  editable: PropTypes.bool,
  inputStyle: PropTypes.object,
  focusOnComponentMount: PropTypes.bool
}

TextFieldNumber.defaultProps = {
  title: '',
  inputColor: '#777777',
  numberOfLines: 1,
  editable: true,
  focusOnComponentMount: true
}

const styles = StyleSheet.create({
  textHeader: {
    flex: 0.4,
    textAlign: 'center'
  },
  inputMain: {
    flex: 1,
    color: 'black'
  }
})
