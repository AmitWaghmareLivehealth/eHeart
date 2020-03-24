import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { TextField, Button, ErrorText } from '../../components'

import { Routes, stringsAlert, Global, Color } from '../../../utils'
import { HeaderGetStartedSuperLarge } from '../../../scenes/layouts'
import styles from './styles'
import PropTypes from 'prop-types';

export default class LoginSignupNameScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      invalidMessageVisible: false
    }
    this.goToEmail = this.goToEmail.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
  }

  onChangeText (text) {
    this.setState({ name: text, invalidMessageVisible: false })
  }

  goToEmail () {
    if (this.state.name.length > 4) {
      var params = {
        name: this.state.name,
        mobile: this.props.navigation.state.params.mobile,
        countryCode: this.props.navigation.state.params.countryCode
      }
      this.props.navigation.navigate(Routes.loginSignupEmailScreen, params)
    } else {
      this.setState({ invalidMessageVisible: true })
    }
  }

  render () {
    return (
      <View style={styles.containerMain} >
        <View style={{ flex: 0, flexGrow: 2 }}>
          <HeaderGetStartedSuperLarge
            header={"What's your name?"}
            description={'It will appear on your medical reports'}
          />
          <TextField
            focusOnComponentMount
            style={styles.textPass}
            value={this.state.name}
            height={50}
            placeholder='Enter name.'
            onChangeText={this.onChangeText}
            onSubmitEditing={this.goToEmail}
          />
          <ErrorText
            message={stringsAlert.invalidName.message}
            invalidMessageVisible={this.state.invalidMessageVisible}
          />
        </View>
        <View style={styles.containerSub2}>
          <Button
            style={styles.btnProceed}
            onPress={this.goToEmail}
            title='Proceed'
          />
        </View>
      </View>
    )
  }
}

LoginSignupNameScreen.propTypes = {
  mobile: PropTypes.string,
  countryCode: PropTypes.string,
  navigation: PropTypes.object
}

LoginSignupNameScreen.defaultProps = {
  mobile: '',
  countryCode: ''
}
