import React, { Component} from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Global } from '../../../utils'
import TextInputHeader from '../text.input.header'
import Separator from '../seperator'
import PropTypes from 'prop-types'

export default class TextFieldNormal extends Component {

  componentDidMount () {
    if (this.props.focusOnComponentMount) {
      this.refs.inputTextField.focus()
    }
  }

  render () {
    var height = this.props.height || 60
    let headerHeight = this.props.title.length > 2 ? (height * 1 / 3) : 0
    var allStyles = StyleSheet.flatten([styles.containerMain, { height: height }, this.props.style])
    var allStylesHeader = StyleSheet.flatten([styles.textHeader, {height: headerHeight}, this.props.titleStyle])
    return (
      <View style={allStyles}>
        <TextInputHeader style={allStylesHeader}>{this.props.title || ''}</TextInputHeader>
        <TextInput
          {...this.props}
          ref='inputTextField'
          style={[styles.inputMain, { height: (height - headerHeight) }, this.props.inputStyle]}
          underlineColorAndroid='transparent'
        >{this.props.children}</TextInput>
        {this.props.showSeparator && <Separator />}
      </View>
    )
  }
}

TextFieldNormal.propTypes = {
  height: PropTypes.number,
  title: PropTypes.string,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  editable: PropTypes.bool,
  inputStyle: PropTypes.object,
  focusOnComponentMount: PropTypes.bool,
  showSeparator: PropTypes.bool,
  titleStyle: PropTypes.object,
  style: PropTypes.object
}

TextFieldNormal.defaultProps = {
  title: '',
  tagTextColor: '#777777',
  inputColor: '#777777',
  numberOfLines: 1,
  editable: true,
  focusOnComponentMount: true,
  showSeparator: true,
  titleStyle: {},
  style: {}
}

const styles = StyleSheet.create({
  containerMain: {
    width: Global.screenWidth * 0.8,
    alignSelf: 'center'
  },
  textHeader: {
    flex: 0.4,
    height: 0,
    fontSize: 14
  },
  inputMain: {
    flex: 1,
    backgroundColor: 'white',
    color: 'black',
    fontSize: 16,
    paddingLeft: 10
  }
})
